import { expect } from '@playwright/test';
import { test } from 'site/base';

test('add button', async ({ page, note }) => {
	await page.goto('/');

	const addButton = page.getByLabel('add');

	await expect(
		addButton,
		'add button is hidden when we are on the base url and no note is typed'
	).toBeHidden();

	await note.type('a');
	await note.locator.press('Backspace');

	await expect(
		addButton,
		'add button is visible after clearing a note (so that we could pick another URL)'
	).toBeVisible();

	await note.type('b');

	const noteUrl = page.url();

	await addButton.click();

	await expect(note.locator, 'note is cleared after adding a new note').toBeEmpty();
	expect(page.url(), 'url changes after pressing add').not.toBe(noteUrl);
});
