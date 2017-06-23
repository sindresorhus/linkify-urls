import test from 'ava';
import {JSDOM} from 'jsdom';
import m from '.';

const {
	document,
	Text
} = new JSDOM().window;

global.Text = Text;
global.document = document;

// Ponyfill until this is in:
// https://github.com/tmpvar/jsdom/issues/317
document.createRange = () => ({
	createContextualFragment(html) {
		const el = document.createElement('template');
		el.innerHTML = html;

		// Work around jsdom implementation issues
		const frag = document.createDocumentFragment();
		frag.appendChild(el.content);

		return frag;
	}
});

const domify = html => {
	return document.createRange().createContextualFragment(html);
};

test(t => {
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

test('type=dom support', t => {
	t.is(
		m('https://sindresorhus.com', {
			type: 'dom'
		}),
		domify('<a href="https://sindresorhus.com">https://sindresorhus.com</a>')
	);
});
