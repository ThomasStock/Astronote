import { notes } from 'store/notes';
import { get } from 'svelte/store';
import type { UndoableCommand } from './types';

export const typeCommand = (id: string, newValue: string): UndoableCommand => {
	const oldNote = get(notes)[id];
	const oldValue = oldNote?.html ?? '';

	const undo = () => {
		updateNote(id, oldValue);
	};

	const execute = () => {
		updateNote(id, newValue);
	};

	const log = () => {
		console.log('from', oldValue, 'to', newValue);
	};

	return {
		type: 'typeCommand',
		timestamp: new Date().getTime(),
		undoable: true,
		execute,
		undo,
		log
	};
};

const updateNote = (id: string, value: string) =>
	notes.update(($notes) => {
		if ($notes[id]) {
			$notes[id]!.html = value;
		}
		return $notes;
	});
