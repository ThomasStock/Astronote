import { derived } from 'svelte/store';
import { notesStore, type Note } from './notes';

export const sortedNotesStore = derived(notesStore, ($notes) => {
	return Object.keys($notes)
		.map<{ key: string; value: Note }>((_) => ({
			key: _,
			value: $notes[_]!
		}))
		.sort((a, b) => a.value.updatedOn - b.value.updatedOn);
});
