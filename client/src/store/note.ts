import { derived } from 'svelte/store';
import { currentId } from './currentId';
import { notes, type Note } from './notes';

export const note = derived<[typeof currentId, typeof notes], Note | undefined>(
	[currentId, notes],
	([$currentId, $notes], set) => {
		if ($currentId) {
			const casedKey = Object.keys($notes).find(
				(_) => _.toLowerCase() === $currentId.toLowerCase()
			);
			if (!casedKey) {
				set(undefined);
			} else {
				const newNote = $notes[$currentId];
				set(newNote);
			}
		}
	}
);
