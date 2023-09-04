import { get } from 'svelte/store';
import { getHistoryState } from './utils/urlStorage';
import { currentId } from './currentId';
import { notes } from './notes';

export const deleteNote = (idToDelete?: string) => {
	const isCurrentNote = idToDelete === get(currentId);
	if (isCurrentNote) {
		const state = getHistoryState();
		// After deleting the current note, go back to previous page
		if (state.__notes?.previousHref) {
			window.history.back();
		}
	}
	if (idToDelete) {
		notes.update((old) => {
			const ret = { ...old };
			delete ret[idToDelete];
			return ret;
		});
	}
};
