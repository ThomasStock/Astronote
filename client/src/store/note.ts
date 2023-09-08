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
		}
	}
);

export const canRedo = derived([noteStore], ([note]) => note && note.historyIndex < 0);

export const canUndo = derived(
	[noteStore],
	([note]) => note && note.versions.length - 1 + note.historyIndex > 0
);

export const redo = () => {
	const note = get(noteStore);
	if (!note) {
		return;
	}

	const versions = note.versions;
	const historyIndex = note.historyIndex;

	const version = versions.at(historyIndex);
	console.log({ version });

	notesStore.update((notes) => {
		notes[note.id] = {
			...note,
			...version,
			historyIndex: historyIndex + 1
		};

		return notes;
	});
};

export const undo = () => {
	const note = get(noteStore);
	if (!note) {
		return;
	}

	const versions = note.versions;
	const historyIndex = note.historyIndex;

	const version = versions.at(historyIndex - 2);

	notesStore.update((notes) => {
		notes[note.id] = {
			...note,
			...version,
			historyIndex: historyIndex - 1
		};

		return notes;
	});
};
