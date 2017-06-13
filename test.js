import test from 'ava';
import m from '.';

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
