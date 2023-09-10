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
				// User chose his own id, but we don't have it cached
				// Set undefined, perhaps we'll get it from the db
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
