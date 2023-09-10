import { currentId } from 'store/currentId';
import { note } from './note';
import { notesStore, type Note } from 'store/notes';
import { noteStore } from 'store/note';
import { debounce } from 'store/utils/debounce';

export const init = () => {
	currentId.subscribe(async (newId) => {
		// get note from supabase
		if (newId) {
			const { error, data } = await note.get(newId);

			if (error) {
				console.log('dbNote.error while retrieving', error);
			}

			if (data?.data) {
				const note = data.data as any as Note;
				console.log('retrieved from db', note);
				notesStore.update((notes) => {
					return { ...notes, [newId]: note };
				});
			}
		}
	});

	const debouncedUpdate = debounce(async (newNote: Note | undefined) => {
		if (newNote) {
			const { error, data, status, statusText } = await note.update(newNote);
			if (error) {
				if (error.code === '20') {
					// do nothing because we aborted due to more recent update
					return;
				}
				console.log('dbNote.error while updating to ', newNote.html, error, status, statusText);
			}
			console.log('upserted to', newNote.html, data);
		}
	}, 100);

	noteStore.subscribe(debouncedUpdate);
};
