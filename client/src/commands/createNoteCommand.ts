import { notesStore } from 'store/notes';
import type { Command } from './types';
import { currentId } from 'store/currentId';
import { generateId } from 'store/generateId';

export const createNoteCommand = (html = ''): Command => {
	const newId = generateId();

	const execute = () => {
		notesStore.update((oldNotes) => {
			const newNotes = { ...oldNotes, [newId]: { id: newId, updatedOn: Date.now(), html: html } };
			return newNotes;
		});
		currentId.set(newId);
	};

	const log = () => {
		console.log(newId, ']with[', html, ']');
	};

	return {
		type: 'createNoteCommand',
		timestamp: new Date().getTime(),
		execute,
		log
	};
};
