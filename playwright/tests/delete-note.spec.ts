import { expect } from '@playwright/test';
import { test } from 'site/base';

test('delete note', async ({ page, note }) => {
	await page.goto('/');

	await note.click();
	await note.type('cache');

	await page.goto('/');

	await note.click();
	await note.type('a');

	const deleteButton = page.getByLabel('delete');
	await deleteButton.click();

	await expect(page, 'returns to empty note after deleting instead of cached note').toHaveURL(
		process.env.BASE_URL
	);

	await note.click();
	await note.type('b');

	const bUrl = page.url();

	const addButton = page.getByLabel('add');
	await addButton.click();

	await note.click();
	await note.type('c');

	await deleteButton.click();

	await expect(page, 'returns to previous note after deleting').toHaveURL(bUrl);
});
