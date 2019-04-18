import {URL} from 'url';
import test from 'ava';
import jsdom from 'jsdom';
import linkifyUrls from '.';

const dom = new jsdom.JSDOM();
global.window = dom.window;
global.document = dom.window.document;

// Ponyfill until this is in:
// https://github.com/tmpvar/jsdom/issues/317
document.createRange = () => ({
	createContextualFragment(html) {
		const element = document.createElement('template');
		element.innerHTML = html;
		return element.content;
	}
});

// Get DOM node from HTML
const domify = html => document.createRange().createContextualFragment(html);

// Get HTML from DOM node
const html = dom => {
	const el = document.createElement('div');
	el.append(dom);
	return el.innerHTML;
};

test('main', t => {
	t.is(
		linkifyUrls('See https://sindresorhus.com and https://github.com/sindresorhus/got'),
		'See <a href="https://sindresorhus.com">https://sindresorhus.com</a> and <a href="https://github.com/sindresorhus/got">https://github.com/sindresorhus/got</a>'
	);

	t.is(
		linkifyUrls('See https://sindresorhus.com', {
			attributes: {
				class: 'unicorn',
				target: '_blank'
			}
		}),
		'See <a href="https://sindresorhus.com" class="unicorn" target="_blank">https://sindresorhus.com</a>'
	);

	t.is(
		linkifyUrls('[![Build Status](https://travis-ci.org/sindresorhus/caprine.svg?branch=master)](https://travis-ci.org/sindresorhus/caprine)'),
		'[![Build Status](<a href="https://travis-ci.org/sindresorhus/caprine.svg?branch=master">https://travis-ci.org/sindresorhus/caprine.svg?branch=master</a>)](<a href="https://travis-ci.org/sindresorhus/caprine">https://travis-ci.org/sindresorhus/caprine</a>)'
	);
});

test('supports boolean and non-string attribute values', t => {
	t.is(
		linkifyUrls('https://sindresorhus.com', {
			attributes: {
				foo: true,
				bar: false,
				one: 1
			}
		}),
		'<a href="https://sindresorhus.com" foo one="1">https://sindresorhus.com</a>'
	);
});

test('DocumentFragment support', t => {
	t.is(
		html(linkifyUrls('See https://sindresorhus.com and https://github.com/sindresorhus/got', {
			type: 'dom'
		})),
		html(domify('See <a href="https://sindresorhus.com">https://sindresorhus.com</a> and <a href="https://github.com/sindresorhus/got">https://github.com/sindresorhus/got</a>'))
	);

	t.is(
		html(linkifyUrls('See https://sindresorhus.com', {
			type: 'dom',
			attributes: {
				class: 'unicorn',
				target: '_blank'
			}
		})),
		html(domify('See <a href="https://sindresorhus.com" class="unicorn" target="_blank">https://sindresorhus.com</a>'))
	);

	t.is(
		html(linkifyUrls('[![Build Status](https://travis-ci.org/sindresorhus/caprine.svg?branch=master)](https://travis-ci.org/sindresorhus/caprine)', {
			type: 'dom'
		})),
		html(domify('[![Build Status](<a href="https://travis-ci.org/sindresorhus/caprine.svg?branch=master">https://travis-ci.org/sindresorhus/caprine.svg?branch=master</a>)](<a href="https://travis-ci.org/sindresorhus/caprine">https://travis-ci.org/sindresorhus/caprine</a>)'))
	);
});

test('escapes the URL', t => {
	t.is(linkifyUrls('http://mysite.com/?emp=1&amp=2'), '<a href="http://mysite.com/?emp=1&amp;amp=2">http://mysite.com/?emp=1&amp;amp=2</a>');
});

test('supports `@` in the URL path', t => {
	t.is(linkifyUrls('https://sindresorhus.com/@foo'), '<a href="https://sindresorhus.com/@foo">https://sindresorhus.com/@foo</a>');
});

test('supports `#!` in the URL path', t => {
	t.is(linkifyUrls('https://twitter.com/#!/sindresorhus'), '<a href="https://twitter.com/#!/sindresorhus">https://twitter.com/#!/sindresorhus</a>');
});

test('supports `,` in the URL path, but not at the end', t => {
	t.is(linkifyUrls('https://sindresorhus.com/?id=foo,bar'), '<a href="https://sindresorhus.com/?id=foo,bar">https://sindresorhus.com/?id=foo,bar</a>');
	t.is(linkifyUrls('https://sindresorhus.com/?id=foo, bar'), '<a href="https://sindresorhus.com/?id=foo">https://sindresorhus.com/?id=foo</a>, bar');
});

test('supports `value` option', t => {
	t.is(linkifyUrls('See https://github.com/sindresorhus.com/linkify-urls for a solution', {
		type: 'string',
		value: 0
	}), 'See <a href="https://github.com/sindresorhus.com/linkify-urls">0</a> for a solution');
});

test('supports `value` option as function', t => {
	t.is(linkifyUrls('See https://github.com/sindresorhus.com/linkify-urls for a solution', {
		value: url => new URL(url).hostname
	}), 'See <a href="https://github.com/sindresorhus.com/linkify-urls">github.com</a> for a solution');
});

test('skips URLs preceded by a `+` sign', t => {
	const fixture = 'git+https://github.com/sindresorhus/ava';
	t.is(linkifyUrls(fixture), fixture);
});

test('supports username in url', t => {
	t.is(linkifyUrls('https://user@sindresorhus.com/@foo'), '<a href="https://user@sindresorhus.com/@foo">https://user@sindresorhus.com/@foo</a>');
});

test('supports a URL with a subdomain', t => {
	t.is(linkifyUrls('http://docs.google.com'), '<a href="http://docs.google.com">http://docs.google.com</a>');
});

test('skips email addresses', t => {
	t.is(linkifyUrls('sindre@example.com'), 'sindre@example.com');
	t.is(linkifyUrls('www.sindre@example.com'), 'www.sindre@example.com');
	t.is(linkifyUrls('sindre@www.example.com'), 'sindre@www.example.com');
});

test('supports localhost URLs', t => {
	t.is(linkifyUrls('http://localhost'), '<a href="http://localhost">http://localhost</a>');
	t.is(linkifyUrls('http://localhost/foo/bar'), '<a href="http://localhost/foo/bar">http://localhost/foo/bar</a>');
});
