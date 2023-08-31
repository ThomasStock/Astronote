import { derived, get } from 'svelte/store';
import { KEYS } from './constants';
import storage from './storage';
import urlStorage from './urlStorage';
import { adjectives, nouns } from './randomWords';

interface Note {
	updatedOn: number;
	html: string;
}
/**
 * Create a cool url-friendly id like smokedCat1
 */
export const generateId = (base?: string, attempt?: number): string => {
	const getResult = () => {
		if (base) {
			if (attempt) {
				return base + attempt;
			} else {
				return base;
			}
		}
		const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		const noun = nouns[Math.floor(Math.random() * nouns.length)];
		return adjective[0].toUpperCase() + adjective.slice(1) + noun[0].toUpperCase() + noun.slice(1);
	};
	const result = getResult();

	const alreadyExists = Boolean(get(notes)[result]);
	if (alreadyExists) {
		return generateId(result, attempt ? attempt + 1 : 1); // add/increase the number postfix
	}

	return result;
};

export const createNote = (html: string) => {
	let newId = generateId();
	const current = get(currentId);
	if (current && !get(note)) {
		newId = current;
	}

	currentId.set(newId);
	notes.update((oldNotes) => {
		const newNotes = { ...oldNotes, [newId]: { updatedOn: Date.now(), html } };
		return newNotes;
	});
};

export const deleteNote = (idToDelete?: string) => {
	// After deleting a note, we show the last-edited note (if any)
	const lastItem = get(sortedNotes).findLast(
		(_) => _.key.toLowerCase() !== idToDelete?.toLowerCase()
	) ?? { key: undefined };
	currentId.set(lastItem.key);

	if (idToDelete) {
		notes.update((old) => {
			const ret = { ...old };
			delete ret[idToDelete];
			return ret;
		});
	}
};

const getCurrentIdFromUrl = () => {
	const idFromUrl = location.pathname.split('/')[1] ?? null;
	return idFromUrl;
};
const getPathForId = (id?: string) => (id ? `/${id}` : '/');
const setCurrentIdInUrl = (newId?: string) => {
	history.pushState(null, '', getPathForId(newId));
};
export const currentId = urlStorage(KEYS.currentId, getCurrentIdFromUrl, setCurrentIdInUrl);

const views = ['search'];
export type View = 'search';
const getCurrenViewFromUrl = () => {
	const viewFromUrl = location.hash.split('#')[1] ?? null;
	if (views.indexOf(viewFromUrl) !== -1) {
		return viewFromUrl as View;
	}
};

export const getUrlForView = derived(currentId, ($currentId) => {
	return (view: View | undefined) => {
		return view ? `#${view}` : getPathForId($currentId);
	};
});
const setCurrentViewInUrl = (newView?: View) => {
	history.pushState(null, '', get(getUrlForView)(newView));
};
export const view = urlStorage<View>(KEYS.view, getCurrenViewFromUrl, setCurrentViewInUrl);

export const notes = storage<Record<string, Note>>(KEYS.notes, {});

export const sortedNotes = derived(notes, ($notes) => {
	return Object.keys($notes)
		.map<{ key: string; value: Note }>((_) => ({
			key: _,
			value: $notes[_]
		}))
		.sort((a, b) => a.value.updatedOn - b.value.updatedOn);
});

export const currentIndex = derived([sortedNotes, currentId], ([$sortedNotes, $currentId]) => {
	if (!$currentId) {
		// Trick the system into thinking we are the 'latest' note.
		// Probably a bad idea to do this.
		return $sortedNotes.length;
	}
	const foundIndex = $sortedNotes.findIndex((_) => _.key === $currentId);

	return foundIndex;
});

export const note = derived([currentId, notes], ([$currentId, $notes]) => {
	if ($currentId) {
		const casedKey = Object.keys($notes).find((_) => _.toLowerCase() === $currentId.toLowerCase());
		return casedKey ? $notes[casedKey] : undefined;
	}
});
