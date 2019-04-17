/// <reference lib="dom"/>

declare namespace linkifyUrls {
	interface Options {
		/**
		HTML attributes to add to the link.
		*/
		readonly attributes?: {
			[attributeName: string]: string | number | boolean | ReadonlyArray<string>;
		};

		/**
		Format of the generated content.

		`'string'` will return it as a flat string like `'Visit <a href="https://example.com">https://example.com</a>'`.

		`'dom'` will return it as a `DocumentFragment` ready to be appended in a DOM safely, like `DocumentFragment(TextNode('Visit '), HTMLAnchorElement('https://example.com'))`. This type only works in the browser.
		*/
		readonly type?: 'string' | 'dom';

		/**
		Set a custom HTML value for the link. Default: The URL.

		@example
		```
		linkifyUrls('See https://sindresorhus.com/foo', {
			value: url => new URL(url).pathname
		});
		//=> 'See <a href="https://sindresorhus.com/foo">/foo</a>'
		```
		*/
		readonly value?: string | ((url: string) => string);

	}

	interface TypeDomOptions extends Options {
		readonly type: 'dom';
	}
}

/**
Linkify URLs in text.

@param text - Text with URLs to linkify.

@example
```
import linkifyUrls = require('linkify-urls');

linkifyUrls('See https://sindresorhus.com', {
	attributes: {
		class: 'unicorn',
		one: 1,
		foo: true,
		multiple: ['a', 'b']
	}
});
//=> 'See <a href="https://sindresorhus.com" class="unicorn" one="1" foo multiple="a b">https://sindresorhus.com</a>'


// In the browser
const fragment = linkifyUrls('See https://sindresorhus.com', {
	type: 'dom',
	attributes: {
		class: 'unicorn',
	}
});
document.body.appendChild(fragment);
```
*/
declare function linkifyUrls(
	text: string,
	options: linkifyUrls.TypeDomOptions
): DocumentFragment;
declare function linkifyUrls(
	text: string,
	options?: linkifyUrls.Options
): string;

export = linkifyUrls;
