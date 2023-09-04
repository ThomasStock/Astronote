import { derived, get, writable } from 'svelte/store';
import { notes, type Note } from './notes';
import { currentId } from './currentId';

interface TypeAction {
	type: 'note';
	from: Note | undefined;
	to: Note;
}

interface CurrentIdAction {
	type: 'id';
	from: string | undefined;
	to: string | undefined;
}

type Action = TypeAction | CurrentIdAction;

export const actions = writable<Action[]>([]);

export const backs = writable(0);

export const canRedo = derived([backs], ([$backs]) => $backs > 0);

export const canUndo = derived(
	[actions, backs],
	([$actions, $backs]) => $actions.length - $backs > 0
);

export const undo = () => {
	const action = get(actions).at(-get(backs));
	if (action) {
		if (action.type === 'note') {
			notes.update((n) => {
				const id = action.to.id;
				if (action.from) {
					n[id] = { ...action.from };
				} else {
					//delete n[id];
				}
				// console.log('undid', action.to);
				return n;
			});
		}
	}

	backs.update((_) => ++_);
};

export const redo = () => {
	console.log('redoing');
	backs.update((_) => --_);
};
