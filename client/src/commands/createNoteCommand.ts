import { notesStore } from 'store/notes';
import { get } from 'svelte/store';
import type { UndoableCommand } from './types';
import { currentId } from 'store/currentId';
import { generateId } from 'store/generateId';

export const createNoteCommand = (html = ''): UndoableCommand => {
	const oldId = get(currentId);
	const newId = generateId();

	const undo = () => {
		notesStore.update(($notes) => {
			delete $notes[newId];
			return $notes;
		});
		currentId.set(oldId);
	};

	const execute = () => {
		notesStore.update((oldNotes) => {
			const newNotes = { ...oldNotes, [newId]: { id: newId, updatedOn: Date.now(), html: html } };
			return newNotes;
		});
		currentId.set(newId);
	};

	const log = (undo?: boolean) => {
		console.log(
			(undo ? 'undid: ' : '') + 'createdNote[',
			oldId,
			']to[',
			newId,
			']with[',
			html,
			']'
		);
	};

	return {
		type: 'createNoteCommand',
		timestamp: new Date().getTime(),
		undoable: true,
		execute,
		undo,
		log
	};
};
