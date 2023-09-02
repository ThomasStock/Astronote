/* eslint-disable no-mixed-spaces-and-tabs */
import { defineConfig, devices } from '@playwright/test';

import { config } from 'dotenv';
config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	timeout: 6000,
	expect: { timeout: 2000 },
	forbidOnly: !!process.env.CI,
	//retries: process.env.CI ? 2 : 0,
	retries: 0,
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [['html', { open: 'never' }]],
	use: {
		baseURL: process.env.BASE_URL,
		trace: 'on-first-retry'
	},

	projects: process.env.CI
		? [
				{
					name: 'chromium',
					use: { ...devices['Desktop Chrome'] }
				},

				{
					name: 'firefox',
					use: { ...devices['Desktop Firefox'] }
				},

				{
					name: 'webkit',
					use: { ...devices['Desktop Safari'] }
				},
				/* Test against mobile viewports. */
				{
					name: 'Mobile Chrome',
					use: { ...devices['Pixel 5'] }
				},
				{
					name: 'Mobile Safari',
					use: { ...devices['iPhone 12'] }
				}
		  ]
		: [
				{
					name: 'chromium',
					use: { ...devices['Desktop Chrome'] }
				}
		  ]
});
