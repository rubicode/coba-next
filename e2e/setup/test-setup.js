// @ts-check
const { chromium } = require('@playwright/test');

/**
 * Global setup for tests
 * This runs once before all tests
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalSetup(config) {
  // Set up a browser context for authentication and reuse
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Example: Setup any test state, like initializing test data
  console.log('Setting up test environment...');
  
  // You could store authenticated state for later reuse
  // await context.storageState({ path: './e2e/setup/storageState.json' });
  
  // Close the browser
  await browser.close();
}

// Export the globalSetup function as default
module.exports = globalSetup;
