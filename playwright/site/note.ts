import { Page } from '@playwright/test';
import { delay } from 'utils/delay';

export const note = (page: Page) => {
	const note = page.locator('#Note');

	// increase when working with undo, since undo undoes everything that happened without 500ms
	let delayAfterType = 50;
	return {
		locator: note,
		setDelay: (ms: number) => {
			delayAfterType = ms;
		},
		type: async (text: string) => {
			await note.click();
			await note.type(text);
			await delay(delayAfterType);
		}
	};
};
