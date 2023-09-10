import { expect } from '@playwright/test';
import { test } from 'site/base';
import { delay } from 'utils/delay';

test('Pick url and create note', async ({ page, browser, note }) => {
	const randomKey = Math.random().toString(36).substring(7);
	await page.goto('/' + randomKey);

	await note.type(randomKey.substring(0, 3));

	// Give the note time to save
	await delay(400);

	// open page in a different context
	const context2 = await browser.newContext();
	const page2 = await context2.newPage();
	await page2.goto('/' + randomKey);
	const note2 = note.withPage(page2);

	await expect(note2.locator, 'Chosen note key is accessable in different browser').toHaveText(
		randomKey.substring(0, 3)
	);
});
