import { expect } from '@playwright/test';
import { test } from 'site/base';

test('add button', async ({ page, note }) => {
	await page.goto('/');

	await note.type('a');
	await note.locator.press('Backspace');

	const addButton = page.getByLabel('add');

	await expect(addButton, 'add button is invisible after clearing a note').toBeHidden();

	await note.type('b');

	await addButton.click();

	await expect(note.locator, 'note is cleared after adding a new note').toBeEmpty();
});
