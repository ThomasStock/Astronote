import { expect } from '@playwright/test';
import { test } from 'site/base';

test('undo redo has a stack per note that is remembered', async ({ page, note }) => {
	// delay after typing stuff, to deal with undo debounce mechanism
	note.setDelay(550);

	await page.goto('/');

	const redoButton = page.getByLabel('redo');
	const undoButton = page.getByLabel('undo');

	await note.type('abc');
	await note.type('def');

	const abcNoteUrl = page.url();

	await page.goto('/');

	await note.type('xyz');
	await note.type('klm');

	const xyzNoteUrl = page.url();

	await undoButton.click();
	await undoButton.click();

	await expect(redoButton, 'xyz note now has 2 redos').toBeVisible();
	await expect(undoButton, 'xyz note now has 0 undos').toBeHidden();

	await page.goto(abcNoteUrl);

	await expect(redoButton, 'abc note has 0 redos').toBeHidden();
	await expect(undoButton, 'abc note has 2 undos').toBeVisible();

	await undoButton.click();

	await expect(redoButton, 'abc note has 1 redos').toBeVisible();
	await expect(undoButton, 'abc note has 1 undos').toBeVisible();

	await page.goto(xyzNoteUrl);

	await expect(redoButton, 'xyz note still has 2 redos').toBeVisible();
	await expect(undoButton, 'xyz note still has 0 undos').toBeHidden();

	await redoButton.click();

	await expect(redoButton, 'xyz note has 1 redos').toBeVisible();
	await expect(undoButton, 'xyz note has 1 undos').toBeVisible();

	await redoButton.click();

	await expect(redoButton, 'xyz note has 0 redos').toBeHidden();
	await expect(undoButton, 'xyz note has 2 undos').toBeVisible();
});
