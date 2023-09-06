import { get } from 'svelte/store';
import { adjectives, nouns } from './utils/randomWords';
import { notesStore } from './notes';

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
		return (
			adjective![0]!.toUpperCase() + adjective!.slice(1) + noun![0]!.toUpperCase() + noun!.slice(1)
		);
	};
	const result = getResult();

	const alreadyExists = Boolean(get(notesStore)[result]);
	if (alreadyExists) {
		return generateId(result, attempt ? attempt + 1 : 1); // add/increase the number postfix
	}

	return result;
};
