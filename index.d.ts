import {type HTMLAttributes} from 'create-html-element';

// Local React types to avoid hard dependency on @types/react
type ReactElement = {
	type: string | ComponentType;
	props: Record<string, unknown>;
	key?: string | number | null | undefined; // eslint-disable-line @typescript-eslint/ban-types
};

type ReactPortal = {
	type: symbol;
	key?: string | number | null | undefined; // eslint-disable-line @typescript-eslint/ban-types
	children: ReactNode;
	containerInfo: unknown;
	implementation: unknown;
};

type ReactNode =
	| ReactElement
	| string
	| number
	| bigint
	| Iterable<ReactNode>
	| ReactPortal
	| boolean
	| null // eslint-disable-line @typescript-eslint/ban-types
	| undefined;

type ComponentType<Properties = Record<string, unknown>> = (properties: Properties) => ReactNode;

export type Options = {
	/**
	HTML attributes to add to the link.

	Security note: For external links, consider adding `rel: 'noreferrer'` to prevent the linked page from accessing `window.opener` and to avoid sending referrer information.

	@example
	```
	linkifyUrlsToHtml('Visit https://example.com', {
		attributes: {
			rel: 'noreferrer',
			target: '_blank'
		}
	});
	//=> 'Visit <a href="https://example.com" rel="noreferrer" target="_blank">https://example.com</a>'
	```
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

/**
React component that linkifies URLs in its children.

@example
```
import React from 'react';
import {LinkifyUrls} from 'linkify-urls';

<LinkifyUrls attributes={{target: '_blank', class: 'link'}}>
	Check out https://example.com for more info
</LinkifyUrls>
```
*/
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LinkifyUrls: ComponentType<Options & {
	readonly children?: ReactNode;
}>;

export {HTMLAttributes} from 'create-html-element';
