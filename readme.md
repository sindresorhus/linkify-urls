# linkify-urls

> Linkify URLs in a string

## Install

```
$ npm install linkify-urls
```

## Usage

```js
const linkifyUrls = require('linkify-urls');

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

## API

### linkifyUrls(string, options?)

#### string

Type: `string`

String with URLs to linkify.

#### options

Type: `object`

##### attributes

Type: `object`

HTML attributes to add to the link.

##### type

Type: `string`\
Values: `'string' | 'dom'`\
Default: `'string'`

Format of the generated content.

`'string'` will return it as a flat string like `'Visit <a href="https://example.com">https://example.com</a>'`.

`'dom'` will return it as a `DocumentFragment` ready to be appended in a DOM safely, like `DocumentFragment(TextNode('Visit '), HTMLAnchorElement('https://example.com'))`. This type only works in the browser.

##### value

Type: `string | Function`\
Default: The URL

Set a custom HTML value for the link.

If it's a function, it will receive the URL as a string:

```js
linkifyUrls('See https://sindresorhus.com/foo', {
	value: url => new URL(url).pathname
});
//=> 'See <a href="https://sindresorhus.com/foo">/foo</a>'
```

## Browser compatibility

Version 3 of this package uses [negative lookbehind regex syntax](https://kangax.github.io/compat-table/es2016plus/#test-RegExp_Lookbehind_Assertions). Stay on version 2 if you need to support browsers that doesn't support this feature.

## Related

- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
- [get-urls](https://github.com/sindresorhus/get-urls) - Get all URLs in a string
