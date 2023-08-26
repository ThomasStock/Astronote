import { derived, get } from 'svelte/store';
import { KEYS } from './constants';
import storage from './storage';

interface Note {
	updatedOn: number;
	html: string;
}

export const createNote = (html: string) => {
	const newId = crypto.randomUUID();
	currentId.set(newId);
	notes.update((oldNotes) => {
		const newNotes = { ...oldNotes, [newId]: { updatedOn: Date.now(), html } };
		return newNotes;
	});
};

export const deleteNote = (idToDelete?: string) => {
	if (idToDelete) {
		// After deleting a note, we show the last-edited note (if any)
		const lastItem = get(sortedNotes).findLast((_) => _.key !== idToDelete) ?? { key: undefined };
		currentId.set(lastItem.key);

		notes.update((old) => {
			const ret = { ...old };
			delete ret[idToDelete];
			return ret;
		});
	}
};

export const currentId = storage<string | undefined>(KEYS.currentId, undefined);

export const notes = storage<Record<string, Note>>(KEYS.notes, {});

export const sortedNotes = derived(notes, ($notes) => {
	return Object.keys($notes)
		.map<{ key: string; value: Note }>((_) => ({
			key: _,
			value: $notes[_]
		}))
		.sort((a, b) => a.value.updatedOn - b.value.updatedOn);
});

export const currentIndex = derived([sortedNotes, currentId], ([$sortedNotes, $currentId]) => {
	if (!$currentId) {
		// Trick the system into thinking we are the 'latest' note.
		// Probably a bad idea to do this.
		return $sortedNotes.length;
	}
	const foundIndex = $sortedNotes.findIndex((_) => _.key === $currentId);

	return foundIndex;
});

export const note = derived([currentId, notes], ([$currentId, $notes]) =>
	$currentId ? $notes[$currentId] : undefined
);
