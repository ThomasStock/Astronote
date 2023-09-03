import { Locator, Page, expect } from '@playwright/test';

export const home = (page: Page) => {
	return {
		visit: () => page.goto('/'),
		note: page.locator('#Note')
	};
};

export const hideableButton = (locator: Locator) => {
	return {
		locator,
		isVisible: async (reason: string) => expect(locator, 'is visible ' + reason).toBeVisible(),
		isHidden: async (reason: string) => expect(locator, 'is hidden ' + reason).toBeHidden()
	};
};
