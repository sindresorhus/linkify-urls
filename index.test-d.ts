import {expectType} from 'tsd';
import {linkifyUrlsToHtml, linkifyUrlsToDom} from './index.js';

expectType<string>(
	linkifyUrlsToHtml('See https://sindresorhus.com', {
		attributes: {
			class: 'unicorn',
			one: 1,
			foo: true,
			multiple: ['a', 'b'],
		},
	}),
);
expectType<string>(
	linkifyUrlsToHtml('See https://sindresorhus.com', {
		value: 'foo',
	}),
);
expectType<string>(
	linkifyUrlsToHtml('See https://sindresorhus.com/foo', {
		value: url => {
			expectType<string>(url);
			return url;
		},
	}),
);
expectType<string>(
	linkifyUrlsToHtml('See https://sindresorhus.com/foo'),
);

const fragment = linkifyUrlsToDom('See https://sindresorhus.com', {
	attributes: {
		class: 'unicorn',
	},
});

expectType<DocumentFragment>(fragment);

document.body.append(fragment);
