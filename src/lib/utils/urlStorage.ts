import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';

// How to detect if URL has changed after hash in JavaScript
// https://stackoverflow.com/a/52809105/72859
(() => {
	let oldPushState = history.pushState;
	history.pushState = function pushState() {
		let ret = oldPushState.apply(this, arguments as any);
		window.dispatchEvent(new Event('pushstate'));
		window.dispatchEvent(new Event('locationchange'));
		return ret;
	};

	let oldReplaceState = history.replaceState;
	history.replaceState = function replaceState() {
		let ret = oldReplaceState.apply(this, arguments as any);
		window.dispatchEvent(new Event('replacestate'));
		window.dispatchEvent(new Event('locationchange'));
		return ret;
	};

	window.addEventListener('popstate', () => {
		window.dispatchEvent(new Event('locationchange'));
	});
})();

const urlStorage = (
	key: string,
	getUrlValue: () => string | undefined,
	setUrlValue: (newVal?: string) => void
): Writable<string | undefined> => {
	const store = writable<string | undefined>(getUrlValue());
	if (!location) return store;

	store.subscribe((val) => {
		if (val == null || val === '') {
			if (getUrlValue()) {
				setUrlValue();
			}
		} else {
			if (val.toLowerCase() !== getUrlValue()?.toLowerCase()) {
				setUrlValue(val);
			}
		}
	});

	window.addEventListener('locationchange', () => {
		const newLocationValue = getUrlValue();
		if (newLocationValue !== get(store)) {
			store.set(newLocationValue);
		}
	});

	return store;
};

export default urlStorage;
