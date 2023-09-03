import { expect } from '@playwright/test';
import { test } from 'site/base';

test('add button', async ({ page, note }) => {
	await page.goto('/');

	await note.click();
	await note.type('a');
	await note.press('Backspace');

	const addButton = page.getByLabel('add');

	await expect(addButton, 'add button is invisible after clearing a note').toBeHidden();
});
