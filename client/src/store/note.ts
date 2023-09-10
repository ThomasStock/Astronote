import { derived, get } from 'svelte/store';
import { currentId } from './currentId';
import { notesStore, type Note } from './notes';

export const noteStore = derived<[typeof currentId, typeof notesStore], Note | undefined>(
	[currentId, notesStore],
	([$currentId, $notes], set) => {
		if ($currentId) {
			const casedKey = Object.keys($notes).find(
				(_) => _.toLowerCase() === $currentId.toLowerCase()
			);
			if (!casedKey) {
				set(undefined);
			} else {
				const newNote = $notes[casedKey];
				set(newNote);
			}
		} else {
			set(undefined);
		}
	}
);
