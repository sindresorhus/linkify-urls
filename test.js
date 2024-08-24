import test from 'ava';
import jsdom from 'jsdom';
import {linkifyUrlsToDom, linkifyUrlsToHtml} from './index.js';

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

/** Get HTML from DOM node */
const html = dom => {
	const element = document.createElement('div');
	element.append(dom);
	return element.innerHTML;
};

for (const [name, linkify] of Object.entries({
	linkifyUrlsToHtml,
	linkifyUrlsToDom: string => `DocumentFragment: ${html(linkifyUrlsToDom(string))}`,
})) {
	test(name + ': main', t => {
		t.snapshot(
			linkify(
				'See https://sindresorhus.com and https://github.com/sindresorhus/got',
			),
		);

		t.snapshot(
			linkify('See https://sindresorhus.com', {
				attributes: {
					class: 'unicorn',
					target: '_blank',
				},
			}),
		);

		t.snapshot(
			linkify(
				'[![Build Status](https://travis-ci.org/sindresorhus/caprine.svg?branch=main)](https://travis-ci.org/sindresorhus/caprine)',
			),
		);
	});

	test(name + ': supports boolean and non-string attribute values', t => {
		t.snapshot(
			linkify('https://sindresorhus.com', {
				attributes: {
					foo: true,
					bar: false,
					one: 1,
				},
			}),
		);
	});

	test(name + ': escapes the URL', t => {
		t.snapshot(linkify('https://mysite.com/?emp=1&amp=2'));
	});

	test(name + ': supports `@` in the URL path', t => {
		t.snapshot(linkify('https://sindresorhus.com/@foo'));
	});

	test(name + ': supports `#!` in the URL path', t => {
		t.snapshot(linkify('https://twitter.com/#!/sindresorhus'));
	});

	test(name + ': supports *$ in the URL path', t => {
		t.snapshot(linkify('https://sindresorhus.com/#1_*'));
		t.snapshot(linkify('https://sindresorhus.com/#1_$'));
	});

	test(name + ': supports `,` in the URL path, but not at the end', t => {
		t.snapshot(linkify('https://sindresorhus.com/?id=foo,bar'));
		t.snapshot(linkify('https://sindresorhus.com/?id=foo, bar'));
	});

	test(name + ': supports `value` option', t => {
		t.snapshot(
			linkify(
				'See https://github.com/sindresorhus.com/linkify-urls for a solution',
				{
					value: 0,
				},
			),
		);
	});

	test(name + ': supports `value` option as function', t => {
		t.snapshot(
			linkify(
				'See https://github.com/sindresorhus.com/linkify-urls for a solution',
				{
					value: url => new URL(url).hostname,
				},
			),
		);
	});

	test(name + ': skips URLs preceded by a `+` sign', t => {
		const fixture = 'git+https://github.com/sindresorhus/ava';
		t.snapshot(linkify(fixture), fixture);
	});

	test(name + ': supports username in url', t => {
		t.snapshot(linkify('https://user@sindresorhus.com/@foo'));
	});

	test(name + ': supports a URL with a subdomain', t => {
		t.snapshot(linkify('https://docs.google.com'));
	});

	test(name + ': skips email addresses', t => {
		t.snapshot(linkify('sindre@example.com'));
		t.snapshot(linkify('www.sindre@example.com'));
		t.snapshot(linkify('sindre@www.example.com'));
	});

	test(name + ': supports localhost URLs', t => {
		t.snapshot(linkify('https://localhost'));
		t.snapshot(linkify('https://localhost/foo/bar'));
	});

	test(name + ': skips truncated URLs', t => {
		t.snapshot(linkify('https://github.com/sindresorhus/linkify-…'));
		t.snapshot(
			linkify(
				'https://github.com/sindresorhus/linkify-… and https://github.com/sindresorhus/linkify-…',
			),
		);
		t.snapshot(
			linkify('https://github.com/sindresorhus/linkify-urls and more…'),
		);

		t.snapshot(linkify('https://github.com/sindresorhus/linkify-...'));
		t.snapshot(
			linkify(
				'https://github.com/sindresorhus/linkify-... and https://github.com/sindresorhus/linkify-...',
			),
		);
		t.snapshot(
			linkify('https://github.com/sindresorhus/linkify-urls and more...'),
		);
	});
}

test.failing('skips the trailing period', t => {
	t.is(linkifyUrlsToHtml('Visit https://fregante.com.'), 'Visit <a href="https://fregante.com">https://fregante.com</a>.');
});
