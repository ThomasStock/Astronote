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

const DEBOUNCE_MS = 500;

export const canRedo = derived([noteStore], ([note]) => {
	return note && note.historyIndex < 0;
});

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

	const nextVersions = versions.slice(versions.length + historyIndex);

	let newHistoryIndex = historyIndex;

	// See 'undo' logic but then reversed.
	let nextDebouncedVersion: Note['versions'][number];
	nextVersions.find((_, i) => {
		newHistoryIndex++;

		const newerVersion = nextVersions[i + 1];
		if (!newerVersion) {
			// this is the last candidate so return it
			nextDebouncedVersion = _;
			return true; // break loop
		}
		const diff = newerVersion.updatedOn - _.updatedOn;
		if (diff > DEBOUNCE_MS) {
			// return the version just when user stopped typing
			nextDebouncedVersion = _;
			return true; // break loop
		}
	});

	notesStore.update((notes) => {
		notes[note.id] = {
			...note,
			...nextDebouncedVersion,
			historyIndex: newHistoryIndex
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

	const previousVersions = versions.slice(0, versions.length - 1 + historyIndex);

	let newHistoryIndex = historyIndex;

	// Example: Current input is abcde. We want to undo.
	// 10.000 ms ago 'abcd' was entered
	// 9.800 ms ago 'abc' was entered
	// 7.000 ms ago 'ac' was entered
	// this thing will return 'abc' because it is less than 500ms (DEBOUNCE_MS) older than the later input
	// but more than 500ms (DEBOUNCE_MS) younger than the previous input.
	let previousDebouncedVersion: Note['versions'][number];
	previousVersions.reverse().find((_, i) => {
		newHistoryIndex--;

		const olderVersion = previousVersions[i + 1];
		if (!olderVersion) {
			// this is the last candidate so return it
			previousDebouncedVersion = _;
			return true; // break loop
		}
		const diff = _.updatedOn - olderVersion.updatedOn;
		if (diff > DEBOUNCE_MS) {
			// return the version just before user started typing
			newHistoryIndex--;
			previousDebouncedVersion = olderVersion;
			return true; // break loop
		}
	});

	notesStore.update((notes) => {
		notes[note.id] = {
			...note,
			...previousDebouncedVersion,
			historyIndex: newHistoryIndex
		};

		return notes;
	});
};
