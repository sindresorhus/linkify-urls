import createHtmlElement from 'create-html-element';

// Capture the whole URL in group 1 to keep `String#split()` support
const urlRegex = () => (/((?<!\+)https?:\/\/(?:www\.)?(?:[-\w.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/g);

// Get `<a>` element as string
const linkify = (href, options) => createHtmlElement({
	name: 'a',
	attributes: {
		href: '',
		...options.attributes,
		href, // eslint-disable-line no-dupe-keys
	},
	text: typeof options.value === 'undefined' ? href : undefined,
	html: typeof options.value === 'undefined' ? undefined
		: (typeof options.value === 'function' ? options.value(href) : options.value),
});

// Get DOM node from HTML
const domify = html => document.createRange().createContextualFragment(html);

const getAsString = (string, options) => string.replace(urlRegex(), (match, _, offset) => offset + match.length + 1 === string.length && string.charAt(offset + match.length) === '…' ? match : linkify(match, options));

const getAsDocumentFragment = (string, options) => {
	const fragment = document.createDocumentFragment();
	const entries = Object.entries(string.split(urlRegex())).map(([k, v]) => [Number(k), v]);
	for (const [index, text] of entries) {
		if (index % 2 && (index + 2 < entries.length || entries[index + 1][1] !== '…')) { // URLs are always in odd positions
			fragment.append(domify(linkify(text, options)));
		} else if (text.length > 0) {
			fragment.append(text);
		}
	}

	return fragment;
};

export default function linkifyUrls(string, options) {
	options = {
		attributes: {},
		type: 'string',
		...options,
	};

	if (options.type === 'string') {
		return getAsString(string, options);
	}

	if (options.type === 'dom') {
		return getAsDocumentFragment(string, options);
	}

	throw new TypeError('The type option must be either `dom` or `string`');
}
