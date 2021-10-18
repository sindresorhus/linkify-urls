import {expectType} from 'tsd';
import linkifyUrls from './index.js';

expectType<string>(
	linkifyUrls('See https://sindresorhus.com', {
		attributes: {
			class: 'unicorn',
			one: 1,
			foo: true,
			multiple: ['a', 'b'],
		},
	}),
);
expectType<string>(
	linkifyUrls('See https://sindresorhus.com', {
		value: 'foo',
	}),
);
expectType<string>(
	linkifyUrls('See https://sindresorhus.com/foo', {
		value: url => {
			expectType<string>(url);
			return url;
		},
	}),
);
expectType<string>(
	linkifyUrls('See https://sindresorhus.com/foo', {
		type: 'string',
	}),
);

const fragment = linkifyUrls('See https://sindresorhus.com', {
	type: 'dom',
	attributes: {
		class: 'unicorn',
	},
});

expectType<DocumentFragment>(fragment);

document.body.append(fragment);
