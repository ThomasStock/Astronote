import { currentId } from './currentId';

export const startNewNote = () => {
	currentId.set(undefined);
};
