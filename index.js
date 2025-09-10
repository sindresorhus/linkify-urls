import createHtmlElement from 'create-html-element';

// Capture the whole URL in group 1 to keep `String#split()` support
const urlRegex = () => (/((?<!\+)https?:\/\/(?:www\.)?(?:[-\p{Letter}\d.]+?[.@][a-zA-Z\d]{2,}|localhost|\[[0-9a-fA-F:]+(?:\.[0-9]{1,3}){0,4}\])(?:[-\w\p{Letter}.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/gu);

const parseValue = (value, href) => {
	switch (typeof value) {
		case 'function': {
			return {html: value(href)};
		}

		case 'undefined': {
			return {text: href};
		}

		default: {
			return {html: value};
		}
	}
};

// Get `<a>` element as string
function linkify(url, options = {}) {
	const {href, punctuation} = parseUrl(url);

	return createHtmlElement({
		name: 'a',
		// First `href` is needed for the `href` attribute to be the first attribute on the `a` tag
		attributes: {
			href,
			...options.attributes,
			href, // eslint-disable-line no-dupe-keys -- Ensures it's not overwritten
		},
		...parseValue(options.value, href),
	}) + punctuation;
}

// Get DOM node from HTML
const domify = html => document.createRange().createContextualFragment(html);

const isTruncated = (url, peek) =>
	url.endsWith('...') // `...` is a matched by the URL regex
	|| peek.startsWith('…'); // `…` can follow the match

// Extract href and punctuation from URL
function parseUrl(url) {
	// The URL regex mistakenly includes punctuation (a period or question mark) at the end of the URL
	const punctuation = /[.?]$/.exec(url)?.[0] ?? '';
	const href = punctuation ? url.slice(0, -1) : url;
	return {href, punctuation};
}

// Shared function to process URL parts into linkified content
function processUrlParts(string, options, renderer) {
	const parts = string.split(urlRegex());
	const results = [];

	for (const [index, text] of parts.entries()) {
		// URLs are always in odd positions
		if (index % 2 && !isTruncated(text, parts[index + 1])) {
			results.push(renderer.link(text, options, index));
		} else if (text.length > 0) {
			results.push(renderer.text(text));
		}
	}

	return results;
}

export function linkifyUrlsToHtml(string, options) {
	const replacer = (url, _, offset) =>
		isTruncated(url, string.charAt(offset + url.length))
			? url // Don't linkify truncated URLs
			: linkify(url, options);

	return string.replace(urlRegex(), replacer);
}

export function linkifyUrlsToDom(string, options) {
	const fragment = document.createDocumentFragment();

	const renderer = {
		link: (url, options) => domify(linkify(url, options)),
		text: text => text,
	};

	const results = processUrlParts(string, options, renderer);
	for (const result of results) {
		fragment.append(result);
	}

	return fragment;
}

// React component - can be imported and used directly
export function LinkifyUrls({children, ...options}) {
	// Import React dynamically to avoid making it a hard dependency
	const {React} = globalThis;

	if (!React) {
		throw new Error('LinkifyUrls requires React to be available globally. Make sure React is imported in your app.');
	}

	const {useMemo} = React;

	// Return non-string children as-is
	if (typeof children !== 'string') {
		return children;
	}

	// Convert linkified content to React elements
	const linkifiedContent = useMemo(() => {
		const renderer = {
			link(url, options, index) {
				const {href, punctuation} = parseUrl(url);
				const linkText = options.value
					? (typeof options.value === 'function' ? options.value(href) : options.value)
					: href;

				return [
					React.createElement('a', {
						key: `${index}-${href}`,
						href,
						...options.attributes,
					}, linkText),
					punctuation,
				];
			},
			text: text => text,
		};

		return processUrlParts(children, options, renderer).flat();
	}, [children, options]);

	return React.createElement(React.Fragment, null, ...linkifiedContent);
}
