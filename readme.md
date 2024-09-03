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

#### options

See [options](#options) above.

## Related

- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
- [get-urls](https://github.com/sindresorhus/get-urls) - Get all URLs in a string
