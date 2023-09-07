import { notesStore } from 'store/notes';
import { get } from 'svelte/store';
import type { Command, UndoableCommand } from './types';

interface TypeCommandParams {
	id: string;
	input: string;
	oldInput: string;
	oldOffset: [number, number];
	newOffset: [number, number];
}
export const typeCommand = ({
	id,
	input,
	oldInput,
	oldOffset,
	newOffset
}: TypeCommandParams): TypeCommand => {
	const oldValue = oldInput;

	const undo = () => {
		updateNote(id, oldValue);
	};

	const execute = () => {
		updateNote(id, input);
	};

	const log = () => {
		console.log('id', id, 'from', oldValue, oldOffset, 'to', input, newOffset);
	};

	return {
		type: 'typeCommand',
		timestamp: new Date().getTime(),
		undoable: true,
		execute,
		undo,
		log,
		oldSelectionOffset: oldOffset,
		newSelectionOffset: newOffset
	};
};

const updateNote = (id: string, value: string) => {
	console.log('updating note:', id, value);
	notesStore.update(($notes) => {
		if ($notes[id]) {
			$notes[id]!.html = value;
		}
		return $notes;
	});
};
export interface TypeCommand extends UndoableCommand {
	oldSelectionOffset: [number, number];
	newSelectionOffset: [number, number];
}

export const isTypeCommand = (command: Command): command is TypeCommand =>
	command.type === 'typeCommand';
