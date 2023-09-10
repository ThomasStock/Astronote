import { Page } from '@playwright/test';
import { delay } from 'utils/delay';

export const note = (page: Page) => {
	const locator = page.locator('#Note');

	// increase when working with undo, since undo undoes everything that happened without 500ms
	let delayAfterType = 50;
	return {
		locator: locator,
		setDelay: (ms: number) => {
			delayAfterType = ms;
		},
		type: async (text: string) => {
			await locator.click();
			await locator.type(text);
			await delay(delayAfterType);
		},
		withPage: (page: Page) => {
			return note(page);
		}
	};
};
