import { derived, writable } from 'svelte/store';

export const actions = writable<{ [key: string]: any }[]>([]);

export const canRedo = derived(actions, ($actions) => false);

export const canUndo = derived(actions, ($actions) => Boolean($actions.length));

export const undo = () => {
	console.log('undoing');
};

export const redo = () => {
	console.log('redoing');
};
