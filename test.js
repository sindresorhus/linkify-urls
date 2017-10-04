import test from 'ava';
import jsdom from 'jsdom';
import m from '.';

const dom = new jsdom.JSDOM();
global.window = dom.window;
global.document = dom.window.document;

// Ponyfill until this is in:
// https://github.com/tmpvar/jsdom/issues/317
document.createRange = () => ({
	createContextualFragment(html) {
		const el = document.createElement('template');
		el.innerHTML = html;
		return el.content;
	}
});

// Get DOM node from HTML
const domify = html => document.createRange().createContextualFragment(html);

// Get HTML from DOM node
const html = dom => {
	const el = document.createElement('div');
	el.appendChild(dom);
	return el.innerHTML;
};

test('main', t => {
	t.is(
		m('See https://sindresorhus.com and https://github.com/sindresorhus/got'),
		'See <a href="https://sindresorhus.com">https://sindresorhus.com</a> and <a href="https://github.com/sindresorhus/got">https://github.com/sindresorhus/got</a>'
	);

	t.is(
		m('See https://sindresorhus.com', {
			attributes: {
				class: 'unicorn',
				target: '_blank'
			}
		}),
		'See <a href="https://sindresorhus.com" class="unicorn" target="_blank">https://sindresorhus.com</a>'
	);

	t.is(
		m('[![Build Status](https://travis-ci.org/sindresorhus/caprine.svg?branch=master)](https://travis-ci.org/sindresorhus/caprine)'),
		'[![Build Status](<a href="https://travis-ci.org/sindresorhus/caprine.svg?branch=master">https://travis-ci.org/sindresorhus/caprine.svg?branch=master</a>)](<a href="https://travis-ci.org/sindresorhus/caprine">https://travis-ci.org/sindresorhus/caprine</a>)'
	);
});

test('supports boolean and non-string attribute values', t => {
	t.is(
		m('https://sindresorhus.com', {
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
		html(m('See https://sindresorhus.com and https://github.com/sindresorhus/got', {
			type: 'dom'
		})),
		html(domify('See <a href="https://sindresorhus.com">https://sindresorhus.com</a> and <a href="https://github.com/sindresorhus/got">https://github.com/sindresorhus/got</a>'))
	);

	t.is(
		html(m('See https://sindresorhus.com', {
			type: 'dom',
			attributes: {
				class: 'unicorn',
				target: '_blank'
			}
		})),
		html(domify('See <a href="https://sindresorhus.com" class="unicorn" target="_blank">https://sindresorhus.com</a>'))
	);

	t.is(
		html(m('[![Build Status](https://travis-ci.org/sindresorhus/caprine.svg?branch=master)](https://travis-ci.org/sindresorhus/caprine)', {
			type: 'dom'
		})),
		html(domify('[![Build Status](<a href="https://travis-ci.org/sindresorhus/caprine.svg?branch=master">https://travis-ci.org/sindresorhus/caprine.svg?branch=master</a>)](<a href="https://travis-ci.org/sindresorhus/caprine">https://travis-ci.org/sindresorhus/caprine</a>)'))
	);
});

test('supports `@` in the URL path', t => {
	t.is(m('https://sindresorhus.com/@foo'), '<a href="https://sindresorhus.com/@foo">https://sindresorhus.com/@foo</a>');
});

test.failing('skips Git URLs', t => {
	const fixture = 'git+https://github.com/sindreorhus/ava';
	t.is(m(fixture), fixture);
});

test('skips email addresses', t => {
	t.is(m('sindre@example.com'), 'sindre@example.com');
	t.is(m('www.sindre@example.com'), 'www.sindre@example.com');
	t.is(m('sindre@www.example.com'), 'sindre@www.example.com');
});
