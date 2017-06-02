'use strict';
const urlRegex = require('url-regex');
const escapeGoat = require('escape-goat');

module.exports = (input, options) => {
	options = Object.assign({
		attributes: {}
	}, options);

	let attributes = Object.keys(options.attributes).map(key => {
		const value = options.attributes[key];
		return `${escapeGoat.escape(key)}="${escapeGoat.escape(value)}"`;
	});
	attributes = attributes.length > 0 ? ' ' + attributes.join(' ') : '';

	return input.replace(urlRegex(), match => `<a href="${match}"${attributes}>${match}</a>`);
};
