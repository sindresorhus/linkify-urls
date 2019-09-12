'use strict';
const createHtmlElement = require('create-html-element');

// Capture the whole URL in group 1 to keep `String#split()` support
const urlRegex = () => (/((?<!\+)(?:https?(?::\/\/))(?:www\.)?(?:[a-zA-Z\d-_.]+(?:(?:\.|@)[a-zA-Z\d]{2,})|localhost)(?:(?:[-a-zA-Z\d:%_+.~#!?&//=@]*)(?:[,](?![\s]))*)*)/g);

// Get `<a>` element as string
const linkify = (href, options) => createHtmlElement({
	name: 'a',
	attributes: {
		href: '',
		...options.attributes,
		href // eslint-disable-line no-dupe-keys
	},
	text: typeof options.value === 'undefined' ? href : undefined,
	html: typeof options.value === 'undefined' ? undefined :
		(typeof options.value === 'function' ? options.value(href) : options.value)
});

// Get DOM node from HTML
const domify = html => document.createRange().createContextualFragment(html);

const getAsString = (string, options) => {
	return string.replace(urlRegex(), match => linkify(match, options));
};

const getAsDocumentFragment = (string, options) => {
	return string.split(urlRegex()).reduce((fragment, text, index) => {
		if (index % 2) { // URLs are always in odd positions
			fragment.append(domify(linkify(text, options)));
		} else if (text.length > 0) {
			fragment.append(document.createTextNode(text));
		}

		return fragment;
	}, document.createDocumentFragment());
};

module.exports = (string, options = {}) => {
	const defaultOptions = {
		attributes: {
			rel: 'noreferrer'
		},
		type: 'string'
	};

	options = {
		...defaultOptions,
		...options,
		attributes: {
			...defaultOptions.attributes,
			...options.attributes
		}
	};

	if (options.type === 'string') {
		return getAsString(string, options);
	}

	if (options.type === 'dom') {
		return getAsDocumentFragment(string, options);
	}

	throw new Error('The type option must be either `dom` or `string`');
};
