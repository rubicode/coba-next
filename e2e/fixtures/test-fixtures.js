// @ts-check
import { test as base } from '@playwright/test';
import { login, createTestUser, createUserViaAPI, deleteUserViaAPI } from '../utils/test-utils';

/**
 * Define custom test fixtures
 * Properly typed using the Fixtures type
 */
export const test = base.extend({
  // Define your custom fixtures here
});

/**
 * Creates a test user for testing purposes
 * @returns {Object} A test user object
 */
export function getTestUser() {
  return createTestUser();
}

/**
 * Store for test data that needs to be shared between setup and teardown
 * @type {Object}
 */
export const testContext = {
  createdUsers: []
};

/**
 * Utility function to create an authenticated context for tests
 * Creates a temporary test user if needed
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {Promise<Object>} - Test user info including credentials and token
 */
export async function setupAuthContext(page) {
  // Check if we're already logged in (looking at URL or visible elements)
  const currentUrl = page.url();
  if (currentUrl.includes('/todos') || 
      currentUrl.includes('/dashboard') || 
      currentUrl.includes('/profile')) {
    console.log('Already on authenticated page:', currentUrl);
    return testContext.currentUser; // Already logged in
  }
  
  // Look for logout button which would indicate we're already logged in
  const logoutVisible = await page.locator('text=Logout, button:has-text("Logout")').isVisible().catch(() => false);
  if (logoutVisible) {
    console.log('Already logged in (found logout button)');
    return testContext.currentUser; // Already logged in
  }
  
  console.log('Creating temporary test user for authentication...');
  
  try {
    // Create a unique test user for this test run with a fixed structure to avoid issues
    const username = `testuser${Math.floor(Math.random() * 10000)}`;
    const password = 'Password12345';
    
    const tempUser = {
      username,
      password,
      rePassword: password // CRITICAL: Ensure they match exactly
    };
    
    console.log(`Generated test username: ${tempUser.username}`);
    console.log('Password and rePassword match:', tempUser.password === tempUser.rePassword);
    
    // Create the user via API
    const createdUser = await createUserViaAPI(tempUser);
    
    // Store the created user in the test context for later cleanup
    testContext.currentUser = createdUser;
    testContext.createdUsers.push(createdUser);
    
    console.log(`Test user created with ID: ${createdUser.userId || 'unknown'}`);
    
    // Login with the newly created user
    console.log('Logging in with created test user');
    await login(page, tempUser.username, tempUser.password);
    
    // Wait for confirmation of successful login (URL or visual indicators)
    try {
      await page.waitForURL('**/todos', { timeout: 5000 });
      console.log('Successfully redirected to todos page after login');
    } catch (e) {
      // If not redirected, check if we're still on the login page
      const isLoginPage = await page.locator('input[type="password"]').isVisible().catch(() => false);
      if (isLoginPage) {
        console.log('Still on login page after login attempt, authentication may have failed');
        throw new Error('Authentication failed - still on login page');
      }
      
      console.log('Not redirected to /todos but not on login page either, continuing');
    }
    
    return createdUser;
  } catch (e) {
    console.error(`Authentication setup failed: ${e.message}`);
    throw e; // Propagate the error as this is critical for todos tests
  }
}

/**
 * Cleanup function to delete any test users that were created
 * Use this in afterAll or afterEach hooks
 */
export async function cleanupTestUsers() {
  console.log(`Cleaning up ${testContext.createdUsers.length} test users...`);
  
  const deletePromises = testContext.createdUsers.map(user => {
    if (user && user.userId && user.token) {
      return deleteUserViaAPI(user.userId, user.token);
    }
    return Promise.resolve(false);
  });
  
  try {
    await Promise.allSettled(deletePromises);
    console.log('User cleanup completed');
    
    // Clear the array after deletion attempts
    testContext.createdUsers = [];
    testContext.currentUser = null;
  } catch (e) {
    console.error(`Error during user cleanup: ${e.message}`);
  }
}
