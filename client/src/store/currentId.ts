import { KEYS } from './utils/constants';
import urlStorage, { getHistoryState } from './utils/urlStorage';

const getCurrentIdFromUrl = () => {
	const idFromUrl = location.pathname.split('/')[1] ?? null;
	return idFromUrl;
};
export const getPathForId = (id?: string) => (id ? `/${id}` : '/');
const setCurrentIdInUrl = (newId?: string) => {
	const previous = getCurrentIdFromUrl();
	const typedNewNote = newId && !previous;

	const cameFromNewPage = !getHistoryState().__notes?.previousHref;

	if (typedNewNote && !cameFromNewPage) {
		// When user clicked 'add' and then start typing,
		//  make sure pressing 'back' doesnt go to an empty page
		// 	but instead go to the page-before-user-clicked-add
		history.replaceState(null, '', getPathForId(newId));
	} else {
		history.pushState(null, '', getPathForId(newId));
	}
};
export const currentId = urlStorage(KEYS.currentId, getCurrentIdFromUrl, setCurrentIdInUrl);
