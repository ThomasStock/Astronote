import { notesStore } from 'store/notes';
import { get } from 'svelte/store';
import type { Command, UndoableCommand } from './types';

export const typeCommand = (
	id: string,
	newValue: string,
	oldSelectionOffset: [number, number],
	newSelectionOffset: [number, number]
): TypeCommand => {
	const oldNote = get(notesStore)[id];
	const oldValue = oldNote?.html ?? '';

	const undo = () => {
		updateNote(id, oldValue);
	};

	const execute = () => {
		updateNote(id, newValue);
	};

	const log = () => {
		console.log('id', id, 'from', oldValue, oldSelectionOffset, 'to', newValue, newSelectionOffset);
	};

	return {
		type: 'typeCommand',
		timestamp: new Date().getTime(),
		undoable: true,
		execute,
		undo,
		log,
		oldSelectionOffset,
		newSelectionOffset
	};
};

const updateNote = (id: string, value: string) =>
	notesStore.update(($notes) => {
		if ($notes[id]) {
			$notes[id]!.html = value;
		}
		return $notes;
	});

export interface TypeCommand extends UndoableCommand {
	oldSelectionOffset: [number, number];
	newSelectionOffset: [number, number];
}

export const isTypeCommand = (command: Command): command is TypeCommand =>
	command.type === 'typeCommand';
