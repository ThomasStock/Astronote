import { get } from 'svelte/store';
import { generateId } from './generateId';
import { currentId } from './currentId';
import { note } from './note';
import { notes } from './notes';

export const createNote = (html: string) => {
	let newId = generateId();
	const current = get(currentId);
	if (current && !get(note)) {
		newId = current;
	}

	notes.update((oldNotes) => {
		const newNotes = { ...oldNotes, [newId]: { id: newId, updatedOn: Date.now(), html } };
		return newNotes;
	});
	currentId.set(newId);
};
