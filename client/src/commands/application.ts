import { writable, derived, get } from 'svelte/store';
import { isUndoable, type Command, type UndoableCommand, type CommandSubscriber } from './types';
import { currentId } from 'store/currentId';

export const actionsStore = writable<UndoableCommand[]>([]);

// -2 means we are 2 undo's deep
export const historyIndexStore = writable(0);

const subscribers: Array<CommandSubscriber> = [];
export const subscribe = (onRun: CommandSubscriber) => subscribers.push(onRun);

export const run = (command: Command) => {
	command.execute();

	// Did the user undo actions?
	if (get(historyIndexStore)) {
		console.log('clearing', get(historyIndexStore));
		clearUndoneActions();
	}

	// Should we add the command to the undo stack?
	if (isUndoable(command)) {
		actionsStore.update((actions) => {
			actions.push(command);
			return actions;
		});
	}

	// Inform any interested parties of this command occurance
	subscribers.forEach((sub) => sub(command));
};

const clearUndoneActions = () => {
	// Clear the 'undone' actions because they are no longer valid.
	actionsStore.update((actions) => {
		actions.splice(get(historyIndexStore));
		console.log('new actions', JSON.stringify(actions));
		return actions;
	});
	historyIndexStore.set(0);
};

export const canRedo = derived([historyIndexStore], ([$historyIndex]) => $historyIndex < 0);

export const canUndo = derived(
	[actionsStore, historyIndexStore],
	([$actions, $historyIndex]) => $actions.length + $historyIndex > 0
);

export const undo = () => {
	const $actions = get(actionsStore);
	const command = $actions.at(get(historyIndexStore) - 1);
	if (command) {
		command.undo();
		console.log('undone:');
		command.log();

		// Inform any interested parties of this command being undone
		subscribers.forEach((sub) => sub(command, { undo: true }));
	}
	historyIndexStore.update((_) => --_);
};

export const redo = () => {
	const command = get(actionsStore).at(get(historyIndexStore));
	if (command) {
		command.execute();

		// Inform any interested parties of this command being redone
		subscribers.forEach((sub) => sub(command, { redo: true }));
	}
	historyIndexStore.update((_) => ++_);
};

// undo is per note
currentId.subscribe(() => {
	actionsStore.set([]);
	historyIndexStore.set(0);
});
