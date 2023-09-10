import { currentId } from 'store/currentId';
import { note } from './note';
import { notesStore, type Note } from 'store/notes';

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
};
