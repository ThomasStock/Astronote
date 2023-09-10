import { currentId } from 'store/currentId';
import { note } from './note';
import { notesStore, type Note } from 'store/notes';
import { noteStore } from 'store/note';

export const init = () => {
	currentId.subscribe(async (newId) => {
		// get note from supabase
		if (newId) {
			const { error, data } = await note.get(newId);

			if (error) {
				console.log('dbNote.error', error);
			}

			if (data?.data) {
				const note = data.data as any as Note;
				notesStore.update((notes) => {
					return { ...notes, [newId]: note };
				});
			}
		}
	});

	noteStore.subscribe(async (newNote) => {
		if (newNote) {
			const { error, data, status, statusText } = await note.update(newNote);
			if (error) {
				if (error.code === '20') {
					// do nothing because we aborted
					return;
				}
				console.log('dbNote.error while updating to ', newNote.html, error, status, statusText);
			}
			console.log('updated to', newNote.html, data);
		}
	});
};
