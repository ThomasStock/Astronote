import { derived, get, type Readable } from 'svelte/store';
import { currentId } from './currentId';
import { notes, type Note } from './notes';
import { debounce } from './utils/debounce';
import { actions } from './actions';

let lastNote: Note | undefined;
export const note = derived<[typeof currentId, typeof notes], Note | undefined>(
	[currentId, notes],
	([$currentId, $notes], set) => {
		if ($currentId) {
			const casedKey = Object.keys($notes).find(
				(_) => _.toLowerCase() === $currentId.toLowerCase()
			);
			if (!casedKey) {
				set(undefined);
				lastNote = undefined;
			} else {
				const newNote = $notes[$currentId];
				if (newNote.html !== lastNote?.html) {
					console.log('setting cuz', newNote.html, 'is not', lastNote?.html);
					set(newNote);
					lastNote = newNote;
				}
			}
		}
	}
);

const debouncer = debounce((func: () => void) => func());

let previousNote = get(note);
note.subscribe((n) => {
	debouncer(() =>
		actions.update((a) => {
			a.push({
				type: 'note',
				from: previousNote,
				to: n
			});
			previousNote = get(note);
			return a;
		})
	);
});
