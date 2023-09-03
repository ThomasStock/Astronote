import { expect } from '@playwright/test';
import { test } from 'site/base';

test('undo-redo', async ({ page, note }) => {
	await page.goto('/');

	const redoButton = page.getByLabel('redo');
	const undoButton = page.getByLabel('undo');

	await expect(redoButton, 'redo button is hidden at start').toBeHidden();
	await expect(undoButton, 'undo button is hidden at start').toBeHidden();

	await note.type('a');

	await expect(redoButton, 'redo button is hidden after typing').toBeHidden();
	await expect(undoButton, 'undo button is visible after typing').toBeVisible();

	await undoButton.click();

	await expect(note, 'typing is undone after pressing undo').toBeEmpty();

	await expect(redoButton, 'redo button is visible after undoing action').toBeVisible();
	await expect(undoButton, 'undo button is hidden after undoing action').toBeHidden();

	await redoButton.click();

	await expect(redoButton, 'redo button is hidden after redoing action').toBeHidden();
	await expect(undoButton, 'undo button is visible after redoing action').toBeVisible();
});
