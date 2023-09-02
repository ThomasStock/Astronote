import { KEYS } from './utils/constants';
import storage from './utils/storage';

export interface Note {
	updatedOn: number;
	html: string;
}

export const notes = storage<Record<string, Note>>(KEYS.notes, {});
