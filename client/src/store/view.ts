import { derived, get } from 'svelte/store';
import { KEYS } from './utils/constants';
import urlStorage from './utils/urlStorage';
import { currentId, getPathForId } from './currentId';

const views = ['search'];
export type View = 'search';
const getCurrenViewFromUrl = () => {
	const viewFromUrl = location.hash.split('#')[1] ?? null;
	if (views.indexOf(viewFromUrl) !== -1) {
		return viewFromUrl as View;
	}
};
export const getUrlForView = derived(currentId, ($currentId) => {
	return (view: View | undefined) => {
		return view ? `#${view}` : getPathForId($currentId);
	};
});
const setCurrentViewInUrl = (newView?: View) => {
	history.pushState(null, '', get(getUrlForView)(newView));
};
export const view = urlStorage<View>(KEYS.view, getCurrenViewFromUrl, setCurrentViewInUrl);
