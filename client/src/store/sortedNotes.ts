import { derived } from 'svelte/store';
import { notes, type Note } from './notes';

export const sortedNotes = derived(notes, ($notes) => {
	return Object.keys($notes)
		.map<{ key: string; value: Note }>((_) => ({
			key: _,
			value: $notes[_]!
		}))
		.sort((a, b) => a.value.updatedOn - b.value.updatedOn);
});
