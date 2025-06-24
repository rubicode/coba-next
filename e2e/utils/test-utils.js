// Utility functions for e2e tests

/**
 * Waits for network requests to complete
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {Promise<void>}
 */
export async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Logs in a user
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} username - Username
 * @param {string} password - User password
 */
export async function login(page, username, password) {
  console.log(`Attempting to login with username: ${username}`);
  
  // Navigate to the root URL (login page)
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('domcontentloaded');
  
  // Debug: capture page details before login attempt
  console.log('Login page URL:', page.url());
  
  // Find username input using various selectors
  const usernameInput = 'input[name="username"], input[id="username"], input[placeholder*="username"], input[type="text"]:not([placeholder*="search"])';
  
  try {
    // Wait for username input to be visible
    await page.waitForSelector(usernameInput, { state: 'visible', timeout: 5000 });
    
    // Fill in username and password
    await page.fill(usernameInput, username);
    await page.fill('input[type="password"]', password);
    
    // Take screenshot before submitting
    await page.screenshot({ path: 'before-login-submit.png' });
    
    // Submit the form
    await Promise.all([
      // Wait for either navigation or network request completion
      page.waitForResponse(response => response.url().includes('/api/auth/login'), { timeout: 10000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    // Try to wait for redirect to todos page
    try {
      await page.waitForURL('**/todos', { timeout: 5000 });
      console.log('Successfully redirected to todos page after login');
    } catch (e) {
      console.log('No redirect to /todos detected, current URL:', page.url());
      // Try alternative detection methods
    }
    
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Take screenshot after login attempt
    await page.screenshot({ path: 'after-login.png' });
    
    console.log('After login URL:', page.url());
    
    // Check if we're on a page that indicates successful login
    if (page.url().includes('/todos') || 
        page.url().includes('/dashboard') || 
        page.url().includes('/profile')) {
      console.log('Login successful based on URL pattern');
    } else {
      console.log('Login may have failed, URL does not match expected patterns');
    }
  } catch (error) {
    console.log(`Login error: ${error.message}`);
    throw new Error(`Login failed: ${error.message}`);
  }
}

/**
 * Creates a random test user data
 * @returns {Object} User data
 */
export function createTestUser() {
  const randomId = Math.floor(Math.random() * 10000);
  // Use a simpler password that won't have issues with special chars
  const password = `Password123${randomId}`;
  
  return {
    username: `testuser${randomId}`,
    password: password,
    rePassword: password // Ensure they match exactly
  };
}

/**
 * Create a test user via API
 * @param {Object} userData - User data with username and password
 * @returns {Promise<Object>} - Created user with token
 */
export async function createUserViaAPI(userData) {
  console.log(`Creating test user via API: ${userData.username}`);
  
  try {
    // Ensure password and rePassword are exactly the same
    if (!userData.rePassword) {
      userData.rePassword = userData.password;
    }
    
    // Log the exact payload we're sending (minus the passwords)
    const requestBody = {
      username: userData.username,
      password: userData.password,
      rePassword: userData.rePassword
    };
    console.log(`Registration request payload: ${JSON.stringify({ username: userData.username })}`);
    console.log(`Password match check: ${userData.password === userData.rePassword ? 'MATCH' : 'NOT MATCHING'}`);
    
    // Create user via API
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create user: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully created test user: ${userData.username}`);
    
    return {
      ...userData,
      ...data // This should include the token, userId, etc.
    };
  } catch (error) {
    console.error(`Error creating user via API: ${error.message}`);
    throw error;
  }
}

/**
 * Delete a test user via API
 * @param {string} userId - User ID to delete
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} - True if deleted successfully
 */
export async function deleteUserViaAPI(userId, token) {
  console.log(`Deleting test user with ID: ${userId}`);
  
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Warning: Failed to delete test user: ${response.status} ${errorText}`);
      return false;
    }
    
    console.log(`Successfully deleted test user with ID: ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting user via API: ${error.message}`);
    return false;
  }
}
