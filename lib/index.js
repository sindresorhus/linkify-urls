'use strict';
// - const urlRegex = require('url-regex');

var createHtmlElement = require('create-html-element');

// Capture the whole URL in group 1 to keep string.split() support
var urlRegex = function urlRegex() {
	return (/((?:https?(?::\/\/))(?:www\.)?[a-zA-Z0-9-_.]+(?:\.[a-zA-Z0-9]{2,})(?:[-a-zA-Z0-9:%_+.~#?&//=@]*))/g
	);
};

// Get <a> element as string
var linkify = function linkify(href, options) {
	return createHtmlElement({
		name: 'a',
		attributes: Object.assign({ href: '' }, options.attributes, { href: href }),
		value: typeof options.value === 'undefined' ? href : options.value
	});
};

// Get DOM node from HTML
var domify = function domify(html) {
	return document.createRange().createContextualFragment(html);
};

var getAsString = function getAsString(input, options) {
	return input.replace(urlRegex(), function (match) {
		return linkify(match, options);
	});
};

var getAsDocumentFragment = function getAsDocumentFragment(input, options) {
	return input.split(urlRegex()).reduce(function (frag, text, index) {
		if (index % 2) {
			// URLs are always in odd positions
			frag.appendChild(domify(linkify(text, options)));
		} else if (text.length > 0) {
			frag.appendChild(document.createTextNode(text));
		}

		return frag;
	}, document.createDocumentFragment());
};

module.exports = function (input, options) {
	options = Object.assign({
		attributes: {},
		type: 'string'
	}, options);

	if (options.type === 'string') {
		return getAsString(input, options);
	}

	if (options.type === 'dom') {
		return getAsDocumentFragment(input, options);
	}

	throw new Error('The type option must be either dom or string');
};