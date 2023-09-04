import { derived, writable } from 'svelte/store';

export const actions = writable<{ [key: string]: any }[]>([]);

export const backs = writable(0);

export const canRedo = derived([backs], ([$backs]) => $backs > 0);

export const canUndo = derived(
	[actions, backs],
	([$actions, $backs]) => $actions.length - $backs > 0
);

export const undo = () => {
	console.log('undoing');
	backs.update((_) => ++_);
};

export const redo = () => {
	console.log('redoing');
	backs.update((_) => --_);
};
