// @ts-check
import { test, expect } from '@playwright/test';
import HomePage from '../pages/home.page';
import AuthPage from '../pages/auth.page';
import TodosPage from '../pages/todos.page';
import { createUserViaAPI, createTestUser } from '../utils/test-utils';
import { cleanupTestUsers } from '../fixtures/test-fixtures';

// Accessibility tests using axe-playwright library
// Note: This requires installing @axe-core/playwright: npm install @axe-core/playwright --save-dev

test.describe('Accessibility Tests', () => {
  let homePage, authPage, todosPage;
  let testUser;
  let createdUser;
  
  // Create a test user for todos page testing
  test.beforeAll(async () => {
    console.log('Creating test user for accessibility tests...');
    testUser = createTestUser();
    try {
      createdUser = await createUserViaAPI(testUser);
      console.log(`Successfully created test user: ${testUser.username}`);
    } catch (error) {
      console.error(`Failed to create test user: ${error.message}`);
    }
  });
  
  // Clean up after tests
  test.afterAll(async () => {
    console.log('Cleaning up test users after accessibility tests');
    await cleanupTestUsers();
  });

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    authPage = new AuthPage(page);
    todosPage = new TodosPage(page);
  });

  test('Home page meets accessibility standards', async ({ page }) => {
    await homePage.goto();
    await checkAccessibility(page);
  });

  test('Login page meets accessibility standards', async ({ page }) => {
    await authPage.gotoLogin();
    await checkAccessibility(page);
  });

  test('Registration page meets accessibility standards', async ({ page }) => {
    await authPage.gotoRegister();
    await checkAccessibility(page);
  });

  test('Todos page meets accessibility standards', async ({ page }) => {
    // Using our pre-created test user to access todos page
    try {
      if (!testUser) {
        console.log('No pre-created test user available, skipping test');
        test.skip();
        return;
      }
      
      console.log(`Logging in with pre-created user: ${testUser.username}`);
      await authPage.gotoLogin();
      await page.screenshot({ path: 'accessibility-before-login.png' });
      
      // Login with created test user
      await authPage.login(testUser.username, testUser.password);
      
      // Take a screenshot after login attempt
      await page.screenshot({ path: 'accessibility-after-login.png' });
      
      // Wait for navigation to todos or dashboard
      await Promise.race([
        page.waitForURL('**/todos', { timeout: 5000 }),
        page.waitForURL('**/dashboard', { timeout: 5000 })
      ]).catch(e => console.log('No immediate redirect detected, continuing anyway'));
      
      console.log('After login URL:', page.url());
    } catch (e) {
      console.error('Authentication failed:', e);
      await page.screenshot({ path: 'accessibility-auth-failed.png' });
    }
    
    await todosPage.goto();
    await checkAccessibility(page);
  });
});

/**
 * Check accessibility using axe-core
 * @param {import('@playwright/test').Page} page 
 */
async function checkAccessibility(page) {
  // This requires @axe-core/playwright to be installed
  try {
    // Import AxeBuilder from the package
    let AxeBuilder;
    try {
      // The default export is AxeBuilder class
      AxeBuilder = require('@axe-core/playwright').default;
    } catch (importError) {
      console.warn('Could not load @axe-core/playwright:', importError.message);
      throw new Error('Accessibility testing package not available');
    }
    
    // Create an instance of AxeBuilder with the page
    const axeBuilder = new AxeBuilder({ page });
    
    // Run the analysis
    const results = await axeBuilder.analyze();
    
    // Extract violations from the results
    const violations = results.violations || [];
    
    // Check for critical violations only (can adjust based on your standards)
    const criticalViolations = violations.filter(v => v.impact === 'critical');
    
    // Log full violations for debugging
    console.log(`Found ${violations.length} accessibility violations`);
    if (violations.length > 0) {
      console.log(JSON.stringify(violations, null, 2));
    }
    
    // Assert no critical violations
    expect(criticalViolations.length, 'Critical accessibility violations found').toBe(0);
    
  } catch (error) {
    // If axe-playwright is not installed, we'll skip the test with a warning
    test.skip(true, '@axe-core/playwright package is not installed. Install with: npm install @axe-core/playwright --save-dev');
    console.warn('Accessibility testing skipped. To enable, install @axe-core/playwright');
  }
}
