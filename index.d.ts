import {HTMLAttributes} from 'create-html-element';

export interface Options {
	/**
	HTML attributes to add to the link.
	*/
	readonly attributes?: HTMLAttributes;

	/**
	The format of the generated content.

	`'string'` will return it as a flat string like `'Visit <a href="https://example.com">https://example.com</a>'`.

	`'dom'` will return it as a `DocumentFragment` ready to be appended in a DOM safely, like `DocumentFragment(TextNode('Visit '), HTMLAnchorElement('https://example.com'))`. This type only works in the browser.
	*/
	readonly type?: 'string' | 'dom';

	/**
	Set a custom HTML value for the link.

	Default: The URL.

	@example
	```
	import linkifyUrls from 'linkify-urls';

	linkifyUrls('See https://sindresorhus.com/foo', {
		value: url => new URL(url).pathname
	});
	//=> 'See <a href="https://sindresorhus.com/foo">/foo</a>'
	```
	*/
	readonly value?: string | ((url: string) => string);

}

export interface TypeDomOptions extends Options {
	readonly type: 'dom';
}

/**
Linkify URLs in a string.

@param string - A string with URLs to linkify.

@example
```
import linkifyUrls from 'linkify-urls';

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
export default function linkifyUrls(
	string: string,
	options: TypeDomOptions
): DocumentFragment;
export default function linkifyUrls(
	string: string,
	options?: Options
): string;

export {HTMLAttributes} from 'create-html-element';
