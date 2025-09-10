# linkify-urls

> Linkify URLs in a string

## Install

```sh
npm install linkify-urls
```

## Usage

```js
import {linkifyUrlsToHtml, linkifyUrlsToDom} from 'linkify-urls';

linkifyUrlsToHtml('See https://sindresorhus.com', {
	attributes: {
		class: 'unicorn',
		one: 1,
		foo: true,
		multiple: [
			'a',
			'b'
		]
	}
});
//=> 'See <a href="https://sindresorhus.com" class="unicorn" one="1" foo multiple="a b">https://sindresorhus.com</a>'


// In the browser
const fragment = linkifyUrlsToDom('See https://sindresorhus.com', {
	attributes: {
		class: 'unicorn',
	}
});
document.body.appendChild(fragment);
```

## API

### linkifyUrlsToHtml(string, options?)

Returns an HTML string like `'Visit <a href="https://example.com">https://example.com</a>'`.

#### string

Type: `string`

A string with URLs to linkify.

#### options

Type: `object`

##### attributes

Type: `object`

HTML attributes to add to the link.

**Security note:** For external links, consider adding `rel: 'noreferrer'` to prevent the linked page from accessing `window.opener` and to avoid sending referrer information. This helps protect against reverse tabnabbing attacks and preserves user privacy:

```js
linkifyUrlsToHtml('Visit https://example.com', {
	attributes: {
		rel: 'noreferrer',
		target: '_blank'
	}
});
//=> 'Visit <a href="https://example.com" rel="noreferrer" target="_blank">https://example.com</a>'
```

##### value

Type: `string | Function`\
Default: The URL

Set a custom HTML value for the link.

If it's a function, it will receive the URL as a string:

```js
linkifyUrlsToHtml('See https://sindresorhus.com/foo', {
	value: url => new URL(url).pathname
});
//=> 'See <a href="https://sindresorhus.com/foo">/foo</a>'
```

### linkifyUrlsToDom(string, options?)

Returns a `DocumentFragment` ready to be appended in a DOM safely, like `DocumentFragment(TextNode('Visit '), HTMLAnchorElement('https://example.com'))`.

This type only works in the browser.

### LinkifyUrls (React component)

React component that linkifies URLs in its children.

```jsx
import React from 'react';
import {LinkifyUrls} from 'linkify-urls';

<LinkifyUrls attributes={{target: '_blank', class: 'link'}}>
	Check out https://example.com for more info.
</LinkifyUrls>

// Alternative to dangerouslySetInnerHTML
<div
	dangerouslySetInnerHTML={{
		__html: linkifyUrlsToHtml('Check out https://example.com', {
			attributes: {target: '_blank'}
		})
	}}
/>
```

#### options

See [options](#options) above.

## Related

- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
- [get-urls](https://github.com/sindresorhus/get-urls) - Get all URLs in a string
