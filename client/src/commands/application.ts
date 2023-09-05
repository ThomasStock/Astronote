import { writable, derived, get } from 'svelte/store';
import { isUndoable, type Command, type UndoableCommand } from './types';

export const actions = writable<UndoableCommand[]>([]);

// -2 means we are 2 undo's deep
export const historyIndex = writable(0);

export const canRedo = derived([historyIndex], ([$historyIndex]) => $historyIndex < 0);

export const canUndo = derived(
	[actions, historyIndex],
	([$actions, $historyIndex]) => $actions.length + $historyIndex > 0
);

export const undo = () => {
	const $actions = get(actions);
	const command = $actions[$actions.length - 1 + get(historyIndex)];
	if (command) {
		command.undo();
		subscribers.forEach((sub) => sub(command, true));
	}
	historyIndex.update((_) => --_);
};

export const redo = () => {
	const command = get(actions).at(get(historyIndex));
	if (command) {
		command.execute();
		subscribers.forEach((sub) => sub(command, true));
	}
	historyIndex.update((_) => ++_);
};

const subscribers: Array<(command: Command, undo?: boolean) => void> = [];
export const subscribe = (onRun: (command: Command, undo?: boolean) => void) =>
	subscribers.push(onRun);

export const run = (command: Command) => {
	command.execute();
	if (isUndoable(command)) {
		actions.update(($actions) => {
			$actions.push(command);
			return $actions;
		});
	}
	subscribers.forEach((sub) => sub(command));
};
