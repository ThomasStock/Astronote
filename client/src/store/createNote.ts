import { currentId } from './currentId';
import { generateId } from './generateId';
import { notesStore } from './notes';

export const createNote = (html: string) => {
	const newId = generateId();

	const versions = [{ html: '', updatedOn: Date.now() }];
	// if (html) {
	// 	// create 2 versions: 1 empty and 1 with the initial value (so we can 'undo' to empty note)
	// 	versions.push({ html, updatedOn: Date.now() });
	// }

	notesStore.update((notes) => {
		const newNotes = {
			...notes,
			[newId]: { id: newId, updatedOn: Date.now(), html, versions, historyIndex: 0 }
		};
		return newNotes;
	});
	currentId.set(newId);
};
