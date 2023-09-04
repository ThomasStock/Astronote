// Log html-changing actions (typing, clearing, pasting, ...)

import { get } from 'svelte/store';
import { actions } from './actions';
import { note } from './note';
import { debounce } from './utils/debounce';

export const logTypingActions = () => {
	const debouncer = debounce((func: () => void) => func());
	let previousNote = { ...get(note) };
	note.subscribe((newNote) => {
		debouncer(() => {
			console.log('debounced check', previousNote, newNote);
			if (previousNote?.id !== newNote?.id) {
				actions.update((a) => {
					a.push({
						type: 'currentId',
						from: previousNote?.id,
						to: newNote?.id
					});
					console.log('pushing currentidchange');
					previousNote = { ...newNote };
					return a;
				});

				return;
			}
			if (!newNote?.html && !previousNote?.html) {
				// ignore nullish changes
				return;
			}
			if (newNote?.html === previousNote?.html) {
				// ignore no-html-changes
				return;
			}
			actions.update((a) => {
				a.push({
					type: 'note',
					from: previousNote,
					to: newNote
				});
				console.log('pushing');
				previousNote = { ...newNote };
				return a;
			});
		});
	});
};
