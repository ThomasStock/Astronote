import { Page } from '@playwright/test';

export const note = (page: Page) => {
	return page.locator('#Note');
};
