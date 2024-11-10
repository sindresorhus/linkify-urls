import createHtmlElement from 'create-html-element';

// Capture the whole URL in group 1 to keep `String#split()` support
const urlRegex = () => (/((?<!\+)https?:\/\/(?:www\.)?(?:[-\p{Letter}.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w\p{Letter}.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/gu);

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
function linkify(href, options = {}) {
	// The regex URL mistakenly includes punctuation (a period or question mark) at the end of the URL
	let punctuation = '';
	if (/[.?]$/.test(href)) {
		punctuation = href.slice(-1);
		href = href.slice(0, -1);
	}

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

export function linkifyUrlsToHtml(string, options) {
	const replacer = (url, _, offset) =>
		isTruncated(url, string.charAt(offset + url.length))
			? url // Don't linkify truncated URLs
			: linkify(url, options);

	return string.replace(urlRegex(), replacer);
}

export function linkifyUrlsToDom(string, options) {
	const fragment = document.createDocumentFragment();
	const parts = string.split(urlRegex());

	for (const [index, text] of parts.entries()) {
		// URLs are always in odd positions
		if (index % 2 && !isTruncated(text, parts[index + 1])) {
			fragment.append(domify(linkify(text, options)));
		} else if (text.length > 0) {
			fragment.append(text);
		}
	}

	return fragment;
}
