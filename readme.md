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


## Related

- [url-regex](https://github.com/kevva/url-regex) - Regular expression for matching URLs
- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
- [get-urls](https://github.com/sindresorhus/get-urls) - Get all URLs in text


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
