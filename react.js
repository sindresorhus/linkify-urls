import React from 'react';
import {parseUrl, processUrlParts} from './utilities.js';

export function LinkifyUrls({children, ...options}) {
	const {useMemo} = React;

	// Return non-string children as-is
	if (typeof children !== 'string') {
		return children;
	}

	// Convert linkified content to React elements
	const linkifiedContent = useMemo(() => {
		const renderer = {
			link(url, options, index) {
				const {href, punctuation} = parseUrl(url);
				const linkText = options.value
					? (typeof options.value === 'function' ? options.value(href) : options.value)
					: href;

				return [
					React.createElement('a', {
						key: `${index}-${href}`,
						href,
						...options.attributes,
					}, linkText),
					punctuation,
				];
			},
			text: text => text,
		};

		return processUrlParts(children, options, renderer).flat();
	}, [children, options]);

	return React.createElement(React.Fragment, null, ...linkifiedContent);
}
