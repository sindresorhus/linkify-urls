import type {ReactNode, ComponentType} from 'react';
import {type Options} from './index.js';

/**
React component that linkifies URLs in its children.

@example
```
import React from 'react';
import {LinkifyUrls} from 'linkify-urls/react';

<LinkifyUrls attributes={{target: '_blank', class: 'link'}}>
	Check out https://example.com for more info
</LinkifyUrls>
```
*/
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LinkifyUrls: ComponentType<Options & {
	readonly children?: ReactNode;
}>;
