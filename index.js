import createHtmlElement from 'create-html-element';

// Capture the whole URL in group 1 to keep `String#split()` support
const urlRegex = () => (/((?<!\+)https?:\/\/(?:www\.)?(?:[-\w.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/g);

const parseValue = (value, href) => {
	switch (typeof value) {
		case 'function':
			return {html: value(href)};
		case 'undefined':
			return {text: href};
		default:
			return {html: value};
	}
};

// Get `<a>` element as string
const linkify = (href, options = {}) => createHtmlElement({
	name: 'a',
	attributes: {
		href: '',
		...options.attributes,
		href, // eslint-disable-line no-dupe-keys
	},
	...parseValue(options.value, href),
});

const linkifyAsElement = (href, options = {}) => {
	const link = document.createElement('a');
	link.href = href;

	for (let [key, value] of Object.entries(options.attributes ?? {})) {
		if (value === false || value === undefined || value === null) {
			continue;
		}

		if (Array.isArray(value)) {
			value = value.join(' ');
		}

		link.setAttribute(key, value);
	}

	const {html, text} = parseValue(options.value, href);

	if (html) {
		link.innerHTML = html;
	} else {
		link.textContent = text;
	}

	return link;
};

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
			fragment.append(linkifyAsElement(text, options));
		} else if (text.length > 0) {
			fragment.append(text);
		}
	}

	return fragment;
}
