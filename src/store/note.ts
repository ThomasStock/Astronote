import { derived } from 'svelte/store';
import { currentId } from './currentId';
import { notes } from './notes';

export const note = derived([currentId, notes], ([$currentId, $notes]) => {
	if ($currentId) {
		const casedKey = Object.keys($notes).find((_) => _.toLowerCase() === $currentId.toLowerCase());
		return casedKey ? $notes[casedKey] : undefined;
	}
});
