import { currentId } from './currentId';
import { generateId } from './generateId';
import { notesStore } from './notes';

export const createNote = (html: string, newId?: string) => {
	const id = newId ?? generateId();

	console.log('creating, id', id, 'html', html);
	const versions = [{ html: '', updatedOn: Date.now() }];

	notesStore.update((notes) => {
		const newNotes = {
			...notes,
			[id]: { id, updatedOn: Date.now(), html, versions, historyIndex: 0 }
		};
		return newNotes;
	});
	currentId.set(id);
};
