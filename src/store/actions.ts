import { derived, writable } from 'svelte/store';

export const actions = writable([]);

export const canRedo = derived(actions, ($actions) => true);

export const canUndo = derived(actions, ($actions) => true);

export const undo = () => {
	console.log('undoing');
};

export const redo = () => {
	console.log('redoing');
};
