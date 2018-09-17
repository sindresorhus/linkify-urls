# linkify-urls [![Build Status](https://travis-ci.org/sindresorhus/linkify-urls.svg?branch=master)](https://travis-ci.org/sindresorhus/linkify-urls)

> Linkify URLs in text


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

### linkifyUrls(input, [options])

#### input

Type: `string`

Text with URLs to linkify.

#### options

Type: `Object`

##### attributes

Type: `Object`

HTML attributes to add to the link.

##### type

Type: `string`<br>
Values: `string` `dom`<br>
Default: `string`

Format of the generated content.

`string` will return it as a flat string like `'Visit <a href="https://example.com">https://example.com</a>'`.

`dom` will return it as a `DocumentFragment` ready to be appended in a DOM safely, like `DocumentFragment(TextNode('Visit '), HTMLAnchorElement('https://example.com'))`. This type only works in the browser.

##### value

Type: `string` `Function`<br>
Default: The URL

Set a custom HTML value for the link.

If it's a function, it will receive the URL as a string:

```js
linkifyUrls('See https://sindresorhus.com/foo', {
	value: url => new URL(url).pathname
});
//=> 'See <a href="https://sindresorhus.com/foo">/foo</a>'
```


## Related

- [url-regex](https://github.com/kevva/url-regex) - Regular expression for matching URLs
- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
- [get-urls](https://github.com/sindresorhus/get-urls) - Get all URLs in text


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
