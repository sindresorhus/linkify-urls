// Capture the whole URL in group 1 to keep `String#split()` support
const urlRegex = () => (/((?<!\+)https?:\/\/(?:www\.)?(?:[-\p{Letter}\d.]+?[.@][a-zA-Z\d]{2,}|localhost|\[[0-9a-fA-F:]+(?:\.[0-9]{1,3}){0,4}\])(?:[-\w\p{Letter}.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/gu);

const isTruncated = (url, peek) =>
	url.endsWith('...') // `...` is a matched by the URL regex
	|| peek.startsWith('…'); // `…` can follow the match

// Extract href and punctuation from URL
export function parseUrl(url) {
	// The URL regex mistakenly includes punctuation (a period or question mark) at the end of the URL
	const punctuation = /[.?]$/.exec(url)?.[0] ?? '';
	const href = punctuation ? url.slice(0, -1) : url;
	return {href, punctuation};
}

// Shared function to process URL parts into linkified content
export function processUrlParts(string, options, renderer) {
	const parts = string.split(urlRegex());
	const results = [];

	for (const [index, text] of parts.entries()) {
		// URLs are always in odd positions
		if (index % 2 && !isTruncated(text, parts[index + 1])) {
			results.push(renderer.link(text, options, index));
		} else if (text.length > 0) {
			results.push(renderer.text(text));
		}
	}

	return results;
}
