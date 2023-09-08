import { get } from 'svelte/store';
import { currentId } from './currentId';
import { notesStore } from './notes';

export const typeNote = (html: string) => {
	notesStore.update((notes) => {
		const id = get(currentId);
		if (!id) {
			return notes;
		}

		const note = notes[id];

		if (!note) {
			console.warn('Expected note to exist but it did not.');
			return notes;
		}

		note.html = html;
		note.updatedOn = new Date().getTime();

		if (note.historyIndex) {
			note.versions.splice(note.versions.length + note.historyIndex);
			note.historyIndex = 0;
		}

		// store previous version
		note.versions.push({ html: note.html, updatedOn: note.updatedOn });

		return notes;
	});
};
