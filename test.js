import {URL} from 'node:url';
import test from 'ava';
import jsdom from 'jsdom';
import linkifyUrls from './index.js';

const dom = new jsdom.JSDOM();
globalThis.window = dom.window;
globalThis.document = dom.window.document;

// Ponyfill until this is in:
// https://github.com/tmpvar/jsdom/issues/317
document.createRange = () => ({
	createContextualFragment(html) {
		const element = document.createElement('template');
		element.innerHTML = html;
		return element.content;
	},
});

// Get DOM node from HTML
const domify = html => document.createRange().createContextualFragment(html);

// Get HTML from DOM node
const html = dom => {
	const element = document.createElement('div');
	element.append(dom);
	return element.innerHTML;
};

test('main', t => {
	t.is(
		linkifyUrls('See https://sindresorhus.com and https://github.com/sindresorhus/got'),
		'See <a href="https://sindresorhus.com">https://sindresorhus.com</a> and <a href="https://github.com/sindresorhus/got">https://github.com/sindresorhus/got</a>',
	);

	t.is(
		linkifyUrls('See https://sindresorhus.com', {
			attributes: {
				class: 'unicorn',
				target: '_blank',
			},
		}),
		'See <a href="https://sindresorhus.com" class="unicorn" target="_blank">https://sindresorhus.com</a>',
	);

	t.is(
		linkifyUrls('[![Build Status](https://travis-ci.org/sindresorhus/caprine.svg?branch=main)](https://travis-ci.org/sindresorhus/caprine)'),
		'[![Build Status](<a href="https://travis-ci.org/sindresorhus/caprine.svg?branch=main">https://travis-ci.org/sindresorhus/caprine.svg?branch=main</a>)](<a href="https://travis-ci.org/sindresorhus/caprine">https://travis-ci.org/sindresorhus/caprine</a>)',
	);
});

test('supports boolean and non-string attribute values', t => {
	t.is(
		linkifyUrls('https://sindresorhus.com', {
			attributes: {
				foo: true,
				bar: false,
				one: 1,
			},
		}),
		'<a href="https://sindresorhus.com" foo one="1">https://sindresorhus.com</a>',
	);
});

test('DocumentFragment support', t => {
	t.is(
		html(linkifyUrls('See https://sindresorhus.com and https://github.com/sindresorhus/got', {
			type: 'dom',
		})),
		html(domify('See <a href="https://sindresorhus.com">https://sindresorhus.com</a> and <a href="https://github.com/sindresorhus/got">https://github.com/sindresorhus/got</a>')),
	);

	t.is(
		html(linkifyUrls('See https://sindresorhus.com', {
			type: 'dom',
			attributes: {
				class: 'unicorn',
				target: '_blank',
			},
		})),
		html(domify('See <a href="https://sindresorhus.com" class="unicorn" target="_blank">https://sindresorhus.com</a>')),
	);

	t.is(
		html(linkifyUrls('[![Build Status](https://travis-ci.org/sindresorhus/caprine.svg?branch=main)](https://travis-ci.org/sindresorhus/caprine)', {
			type: 'dom',
		})),
		html(domify('[![Build Status](<a href="https://travis-ci.org/sindresorhus/caprine.svg?branch=main">https://travis-ci.org/sindresorhus/caprine.svg?branch=main</a>)](<a href="https://travis-ci.org/sindresorhus/caprine">https://travis-ci.org/sindresorhus/caprine</a>)')),
	);
});

test('escapes the URL', t => {
	t.is(linkifyUrls('https://mysite.com/?emp=1&amp=2'), '<a href="https://mysite.com/?emp=1&amp;amp=2">https://mysite.com/?emp=1&amp;amp=2</a>');
});

test('supports `@` in the URL path', t => {
	t.is(linkifyUrls('https://sindresorhus.com/@foo'), '<a href="https://sindresorhus.com/@foo">https://sindresorhus.com/@foo</a>');
});

test('supports `#!` in the URL path', t => {
	t.is(linkifyUrls('https://twitter.com/#!/sindresorhus'), '<a href="https://twitter.com/#!/sindresorhus">https://twitter.com/#!/sindresorhus</a>');
});

test('supports *$ in the URL path', t => {
	t.is(linkifyUrls('https://sindresorhus.com/#1_*'), '<a href="https://sindresorhus.com/#1_*">https://sindresorhus.com/#1_*</a>');
	t.is(linkifyUrls('https://sindresorhus.com/#1_$'), '<a href="https://sindresorhus.com/#1_$">https://sindresorhus.com/#1_$</a>');
});

test('supports `,` in the URL path, but not at the end', t => {
	t.is(linkifyUrls('https://sindresorhus.com/?id=foo,bar'), '<a href="https://sindresorhus.com/?id=foo,bar">https://sindresorhus.com/?id=foo,bar</a>');
	t.is(linkifyUrls('https://sindresorhus.com/?id=foo, bar'), '<a href="https://sindresorhus.com/?id=foo">https://sindresorhus.com/?id=foo</a>, bar');
});

test('supports `value` option', t => {
	t.is(linkifyUrls('See https://github.com/sindresorhus.com/linkify-urls for a solution', {
		type: 'string',
		value: 0,
	}), 'See <a href="https://github.com/sindresorhus.com/linkify-urls">0</a> for a solution');
});

test('supports `value` option as function', t => {
	t.is(linkifyUrls('See https://github.com/sindresorhus.com/linkify-urls for a solution', {
		value: url => new URL(url).hostname,
	}), 'See <a href="https://github.com/sindresorhus.com/linkify-urls">github.com</a> for a solution');
});

test.failing('skips the trailing period', t => {
	t.is(linkifyUrls('Visit https://fregante.com.'), 'Visit <a href="https://fregante.com">https://fregante.com</a>.');
});

test('skips URLs preceded by a `+` sign', t => {
	const fixture = 'git+https://github.com/sindresorhus/ava';
	t.is(linkifyUrls(fixture), fixture);
});

test('supports username in url', t => {
	t.is(linkifyUrls('https://user@sindresorhus.com/@foo'), '<a href="https://user@sindresorhus.com/@foo">https://user@sindresorhus.com/@foo</a>');
});

test('supports a URL with a subdomain', t => {
	t.is(linkifyUrls('https://docs.google.com'), '<a href="https://docs.google.com">https://docs.google.com</a>');
});

test('skips email addresses', t => {
	t.is(linkifyUrls('sindre@example.com'), 'sindre@example.com');
	t.is(linkifyUrls('www.sindre@example.com'), 'www.sindre@example.com');
	t.is(linkifyUrls('sindre@www.example.com'), 'sindre@www.example.com');
});

test('supports localhost URLs', t => {
	t.is(linkifyUrls('https://localhost'), '<a href="https://localhost">https://localhost</a>');
	t.is(linkifyUrls('https://localhost/foo/bar'), '<a href="https://localhost/foo/bar">https://localhost/foo/bar</a>');
});

test('skips truncated URLs', t => {
	t.is(linkifyUrls('https://github.com/sindresorhus/linkify-…'), 'https://github.com/sindresorhus/linkify-…');
	t.is(linkifyUrls('https://github.com/sindresorhus/linkify-… and https://github.com/sindresorhus/linkify-…'), 'https://github.com/sindresorhus/linkify-… and https://github.com/sindresorhus/linkify-…');
	t.is(linkifyUrls('https://github.com/sindresorhus/linkify-urls and more…'), '<a href="https://github.com/sindresorhus/linkify-urls">https://github.com/sindresorhus/linkify-urls</a> and more…');

	t.is(linkifyUrls('https://github.com/sindresorhus/linkify-...'), 'https://github.com/sindresorhus/linkify-...');
	t.is(linkifyUrls('https://github.com/sindresorhus/linkify-... and https://github.com/sindresorhus/linkify-...'), 'https://github.com/sindresorhus/linkify-... and https://github.com/sindresorhus/linkify-...');
	t.is(linkifyUrls('https://github.com/sindresorhus/linkify-urls and more...'), '<a href="https://github.com/sindresorhus/linkify-urls">https://github.com/sindresorhus/linkify-urls</a> and more...');
});

test('skips truncated URLs (DocumentFragment)', t => {
	t.is(
		html(linkifyUrls('See https://github.com/sindresorhus/linkify-urls and https://github.com/sindresorhus/linkify-…', {
			type: 'dom',
		})),
		html(domify('See <a href="https://github.com/sindresorhus/linkify-urls">https://github.com/sindresorhus/linkify-urls</a> and https://github.com/sindresorhus/linkify-…')),
	);
	t.is(
		html(linkifyUrls('See https://github.com/sindresorhus/linkify-urls… and https://github.com/sindresorhus/linkify-…', {
			type: 'dom',
		})),
		html(domify('See https://github.com/sindresorhus/linkify-urls… and https://github.com/sindresorhus/linkify-…')),
	);

	t.is(
		html(linkifyUrls('See https://github.com/sindresorhus/linkify-urls and https://github.com/sindresorhus/linkify-...', {
			type: 'dom',
		})),
		html(domify('See <a href="https://github.com/sindresorhus/linkify-urls">https://github.com/sindresorhus/linkify-urls</a> and https://github.com/sindresorhus/linkify-...')),
	);
	t.is(
		html(linkifyUrls('See https://github.com/sindresorhus/linkify-... and https://github.com/sindresorhus/linkify-...', {
			type: 'dom',
		})),
		html(domify('See https://github.com/sindresorhus/linkify-... and https://github.com/sindresorhus/linkify-...')),
	);
});
