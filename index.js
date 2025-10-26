import createHtmlElement from 'create-html-element';
import {parseUrl, processUrlParts} from './utilities.js';

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

