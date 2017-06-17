'use strict';
// - const urlRegex = require('url-regex');
const createHtmlElement = require('create-html-element');

const urlRegex = () => (/(http(s)?(:\/\/))(www\.)?[a-zA-Z0-9-_.]+(\.[a-zA-Z0-9]{2,})([-a-zA-Z0-9:%_+.~#?&//=]*)/g);

module.exports = (input, options) => {
	options = Object.assign({
		attributes: {}
	}, options);

	return input.replace(urlRegex(), match => createHtmlElement({
		name: 'a',
		attributes: Object.assign({href: ''}, options.attributes, {href: match}),
		value: match
	}));
};
