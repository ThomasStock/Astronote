import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';

export interface HistoryState {
	__notes?: {
		previousHref: string;
	};
}

export const getHistoryState = () => (history.state ?? {}) as HistoryState;

const applyHistoryState = (args: IArguments) => {
	let state = args[0] ?? {};
	state = { ...state, __notes: { previousHref: location.href } };
	const newArgs = [state, ...[...args].splice(1)];
	return newArgs as any;
};

// How to detect if URL has changed after hash in JavaScript
// https://stackoverflow.com/a/52809105/72859
(() => {
	let oldPushState = history.pushState;
	history.pushState = function pushState() {
		let ret = oldPushState.apply(this, applyHistoryState(arguments));
		window.dispatchEvent(new Event('pushstate'));
		window.dispatchEvent(new Event('locationchange'));
		return ret;
	};

	let oldReplaceState = history.replaceState;
	history.replaceState = function replaceState() {
		let ret = oldReplaceState.apply(this, applyHistoryState(arguments));
		window.dispatchEvent(new Event('replacestate'));
		window.dispatchEvent(new Event('locationchange'));
		return ret;
	};

	window.addEventListener('popstate', () => {
		window.dispatchEvent(new Event('locationchange'));
	});
})();

const urlStorage = <T extends string = string>(
	key: string,
	getUrlValue: () => T | undefined,
	setUrlValue: (newVal?: T) => void
): Writable<T | undefined> => {
	const store = writable<T | undefined>(getUrlValue());
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
		if (newLocationValue?.toLowerCase() !== get(store)?.toLowerCase()) {
			store.set(newLocationValue);
		}
	});

	return store;
};

export default urlStorage;
