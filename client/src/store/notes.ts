import { KEYS } from './utils/constants';
import storage from './utils/storage';

export interface Note {
	id: string;
	updatedOn: number;
	html: string;
	versions: { html: string; updatedOn: number }[];
	historyIndex: number;
}

export const notesStore = storage<Record<string, Note>>(KEYS.notes, {});
