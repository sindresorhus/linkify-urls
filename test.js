import test from 'ava';
import jsdom from 'jsdom';
import {linkifyUrlsToDom, linkifyUrlsToHtml} from './index.js';

const dom = new jsdom.JSDOM();
globalThis.window = dom.window;
globalThis.document = dom.window.document;

/** Get HTML from DOM node */
const html = dom => {
	const element = document.createElement('div');
	element.append(dom);
	return element.innerHTML;
};

for (const [name, linkify] of Object.entries({
	linkifyUrlsToHtml,
	linkifyUrlsToDom: (...arguments_) => `DocumentFragment: ${html(linkifyUrlsToDom(...arguments_))}`,
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

	test(name + ': supports CJK URLs', t => {
		t.snapshot(linkify('A URL with 中文: https://语c.com'));
		t.snapshot(linkify('https://github.com/scarf005/hangul-test/wiki/한글-위키-페이지 and other hangul'));
		t.snapshot(linkify('https://www.例.jp?'));
	});

	test(name + ': supports trailing period', t => {
		t.snapshot(linkify('Visit https://fregante.com.'));
	});

	test(name + ': supports IPv6 addresses', t => {
		// IPv6 loopback address
		t.snapshot(linkify('🚀 Playground ready at http://[::1]:5000/graphql'));

		// IPv6 unspecified address (any address)
		t.snapshot(linkify('🚀 Playground ready at http://[::]:5000/graphql'));

		// Regular IPv6 address
		t.snapshot(linkify('Visit http://[2001:db8::1]:8080/path'));

		// IPv6 with HTTPS
		t.snapshot(linkify('Check https://[2001:db8:85a3::8a2e:370:7334]:443/'));
	});

	test(name + ': supports hostnames with numbers', t => {
		// Issue #48 - Hostnames with numbers should be linkified
		t.snapshot(linkify('Check https://qa1-e2e2.company.com'));

		// More examples with numbers in hostnames
		t.snapshot(linkify('Visit https://server123.example.com'));
		t.snapshot(linkify('API at https://api-v2.service.io'));
		t.snapshot(linkify('Dev server https://192.168.1.1:8080'));
		t.snapshot(linkify('S3 bucket https://s3.us-west-2.amazonaws.com'));
	});

	test(name + ': current React usage limitation', t => {
		// Issue #38 - Current React usage requires dangerouslySetInnerHTML
		const result = linkify('Check out https://example.com for more info');
		const expected = name === 'linkifyUrlsToHtml'
			? 'Check out <a href="https://example.com">https://example.com</a> for more info'
			: 'DocumentFragment: Check out <a href="https://example.com">https://example.com</a> for more info';

		// This shows what React users currently have to do - use dangerouslySetInnerHTML
		t.is(result, expected);

		// This test documents the current limitation that React can't use this directly
		// without dangerouslySetInnerHTML due to the HTML string output
		t.snapshot(result);
	});
}

