import {type HTMLAttributes} from 'create-html-element';

export type Options = {
	/**
	HTML attributes to add to the link.
	*/
	readonly attributes?: HTMLAttributes;

	/**
	Set a custom HTML value for the link.

	Default: The URL.

	@example
	```
	import {linkifyUrlsToHtml} from 'linkify-urls';

	linkifyUrlsToHtml('See https://sindresorhus.com/foo', {
		value: url => new URL(url).pathname
	});
	//=> 'See <a href="https://sindresorhus.com/foo">/foo</a>'
	```
	*/
	readonly value?: string | ((url: string) => string);

};

/**
Linkify URLs in a string, returns an HTML string.

@param string - A string with URLs to linkify.

@returns An HTML string like `'Visit <a href="https://example.com">https://example.com</a>'`.

@example
```
import {linkifyUrlsToHtml} from 'linkify-urls';

linkifyUrlsToHtml('See https://sindresorhus.com', {
	attributes: {
		class: 'unicorn',
		one: 1,
		foo: true,
		multiple: ['a', 'b']
	}
});
//=> 'See <a href="https://sindresorhus.com" class="unicorn" one="1" foo multiple="a b">https://sindresorhus.com</a>'
```
*/
export function linkifyUrlsToHtml(
	string: string,
	options?: Options
): string;

/**
Linkify URLs in a string, returns a `DocumentFragment`.

@param string - A string with URLs to linkify.

@returns a `DocumentFragment` ready to be appended in a DOM safely, like `DocumentFragment(TextNode('Visit '), HTMLAnchorElement('https://example.com'))`. This type only works in the browser.

@example
```
import {linkifyUrlsToDom} from 'linkify-urls';

const fragment = linkifyUrlsToDom('See https://sindresorhus.com', {
	attributes: {
		class: 'unicorn',
	}
});
document.body.appendChild(fragment);
```
*/
export function linkifyUrlsToDom(
	string: string,
	options?: Options
): DocumentFragment;

export {HTMLAttributes} from 'create-html-element';
