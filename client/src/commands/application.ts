import { writable, derived, get } from 'svelte/store';
import { isUndoable, type Command, type UndoableCommand } from './types';

export const actionsStore = writable<UndoableCommand[]>([]);

// -2 means we are 2 undo's deep
export const historyIndex = writable(0);

export const canRedo = derived([historyIndex], ([$historyIndex]) => $historyIndex < 0);

export const canUndo = derived(
	[actionsStore, historyIndex],
	([$actions, $historyIndex]) => $actions.length + $historyIndex > 0
);

export const undo = () => {
	const $actions = get(actionsStore);
	const command = $actions[$actions.length - 1 + get(historyIndex)];
	if (command) {
		command.undo();
		subscribers.forEach((sub) => sub(command, { undo: true }));
	}
	historyIndex.update((_) => --_);
};

export const redo = () => {
	const command = get(actionsStore).at(get(historyIndex));
	if (command) {
		command.execute();
		subscribers.forEach((sub) => sub(command, { redo: true }));
	}
	historyIndex.update((_) => ++_);
};

const subscribers: Array<(command: Command, meta?: { undo?: boolean; redo?: boolean }) => void> =
	[];
export const subscribe = (
	onRun: (command: Command, meta?: { undo?: boolean; redo?: boolean }) => void
) => subscribers.push(onRun);

export const run = (command: Command) => {
	command.log();
	command.execute();
	if (command.clearsUndoStack && get(historyIndex)) {
		// User undid actions and started typing.
		clearUndoStack();
	}
	if (isUndoable(command)) {
		actionsStore.update((actions) => {
			actions.push(command);
			return actions;
		});
	}
	subscribers.forEach((sub) => sub(command));
};

const clearUndoStack = () => {
	// Clear the 'undone' actions because they are no longer valid.
	actionsStore.update((actions) => {
		actions.splice(get(historyIndex));
		return actions;
	});
	historyIndex.set(0);
};
