import { currentId } from 'store/currentId';
import { noteApi } from './note';
import { notesStore, type Note } from 'store/notes';
import { noteStore } from 'store/note';
import { debounce } from 'store/utils/debounce';
import { get } from 'svelte/store';

export const init = () => {
	currentId.subscribe(async (id) => {
		// get note from supabase
		if (id) {
			const { error, data } = await noteApi.get(id);

			if (error) {
				console.log('dbNote.error while retrieving', error);
			}

			const noteNotInDatabase = !data?.data;
			if (noteNotInDatabase) {
				return;
			}

			const dbNote = data.data as any as Note;

			const localNote = get(notesStore)[id];
			const localNoteIsMoreRecent = localNote && localNote.updatedOn >= dbNote.updatedOn;
			console.log(
				'localNoteIsMoreRecent',
				localNoteIsMoreRecent,
				localNote?.updatedOn,
				dbNote.updatedOn
			);
			if (localNoteIsMoreRecent) {
				return;
			}

			console.log('GET updating local note', dbNote);
			notesStore.update((notes) => {
				return { ...notes, [id]: dbNote };
			});
		}
	});

	const debouncedUpdate = debounce(async (newNote: Note | undefined) => {
		if (newNote) {
			const { error, data, status, statusText } = await noteApi.update(newNote);
			if (error) {
				if (error.code === '20') {
					// do nothing because we aborted due to more recent update
					return;
				}
				console.log('dbNote.error while updating to ', newNote.html, error, status, statusText);
			}
			console.log('POST upserted to', newNote.html, data);
		}
	}, 100);

	noteStore.subscribe(debouncedUpdate);
};
