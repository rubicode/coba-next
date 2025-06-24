// @ts-check

/**
 * Auth page object representing login/register functionality
 * Following the Page Object Model pattern for better test organization
 */
class AuthPage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page
   */
  constructor(page) {
    this.page = page;
    
    // Define URLs with alternatives - prioritizing '/' as the login URL
    this.loginUrls = ['/', '/login', '/auth/login', '/signin'];
    this.registerUrls = ['/register', '/auth/register', '/signup'];
    
    // Define selectors for login page (matching actual app structure)
    this.usernameInput = 'input[name="username"], input[id="username"], input[type="text"]';
    this.passwordInput = 'input[type="password"], input[name="password"]';
    this.submitButton = 'button[type="submit"], input[type="submit"]';
    this.errorMessage = '.error-message, [data-testid="login-error"], [data-testid="register-error"], .alert-error, .text-red-500, .error';
    
    // Define selectors for registration page
    this.rePasswordInput = 'input[name="rePassword"], input[id="rePassword"]';
  }

  /**
   * Navigate to the login page
   * @returns {Promise<void>}
   */
  async gotoLogin() {
    // Try the first URL in the login URLs array
    await this.page.goto(this.loginUrls[0]);
  }

  /**
   * Navigate to the registration page
   * @returns {Promise<void>}
   */
  async gotoRegister() {
    // Try the first URL in the register URLs array
    await this.page.goto(this.registerUrls[0]);
  }

  /**
   * Fill in the login form and submit
   * @param {string} username - Username
   * @param {string} password - User password
   * @returns {Promise<void>}
   */
  async login(username, password) {
    // Fill in username and password fields
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
    
    // Wait for navigation or response
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Fill in the registration form and submit
   * @param {string} username - Username
   * @param {string} password - User password
   * @param {string} rePassword - Confirm password
   * @returns {Promise<void>}
   */
  async register(username, password, rePassword) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.fill(this.rePasswordInput, rePassword);
    await this.page.click(this.submitButton);
    
    // Wait for navigation or response
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Check if the login form is visible
   * @returns {Promise<boolean>}
   */
  async isLoginFormVisible() {
    try {
      // Wait a moment for the page to fully load
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      // Try various form detection strategies
      // Strategy 1: Check individual form elements
      const usernameVisible = await this.page.locator(this.usernameInput).isVisible();
      const passwordVisible = await this.page.locator(this.passwordInput).isVisible();
      const submitVisible = await this.page.locator(this.submitButton).isVisible();
      
      if (usernameVisible && passwordVisible && submitVisible) {
        return true;
      }
      
      // Strategy 2: Look for a form element
      const formVisible = await this.page.locator('form').isVisible();
      if (formVisible) {
        // If form exists and has at least one input, consider it a login form
        const inputsCount = await this.page.locator('form input').count();
        if (inputsCount >= 2) { // Typically email and password
          return true;
        }
      }
      
      // Strategy 3: Look for common login containers
      const loginContainers = await this.page.locator('[data-testid="login-form"], .login-form, .login-container, .auth-container').isVisible();
      if (loginContainers) {
        return true;
      }
      
      console.log('Login form elements not found');
      return false;
    } catch (error) {
      console.error('Error checking login form visibility:', error);
      return false;
    }
  }

  /**
   * Get error message text if present
   * @returns {Promise<string|null>}
   */
  async getErrorMessage() {
    if (await this.page.locator(this.errorMessage).isVisible()) {
      return await this.page.locator(this.errorMessage).textContent();
    }
    return null;
  }
  
  /**
   * Check if user is logged in
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    try {
      // Check multiple indicators that suggest successful login
      
      // Strategy 1: Look for logout links or buttons
      const logoutSelectors = [
        'text=Logout', 
        'button:has-text("Logout")', 
        'button:has-text("Log out")', 
        'a:has-text("Logout")',
        'a:has-text("Sign out")',
        '[data-testid="logout-button"]'
      ];
      
      for (const selector of logoutSelectors) {
        const isLogoutVisible = await this.page.locator(selector).isVisible().catch(() => false);
        if (isLogoutVisible) {
          console.log('Found logout element:', selector);
          return true;
        }
      }
      
      // Strategy 2: Check for welcome messages that might contain username
      const welcomeSelectors = [
        'text=Welcome', 
        'text=Dashboard',
        '.welcome-message', 
        '.user-greeting',
        '[data-testid="user-greeting"]'
      ];
      
      for (const selector of welcomeSelectors) {
        const isWelcomeVisible = await this.page.locator(selector).isVisible().catch(() => false);
        if (isWelcomeVisible) {
          console.log('Found welcome element:', selector);
          return true;
        }
      }
      
      // Strategy 3: Check if login form is NOT visible (negative check)
      const isLoginFormVisible = await this.isLoginFormVisible().catch(() => true);
      if (!isLoginFormVisible) {
        console.log('Login form is not visible, which suggests user is logged in');
        return true;
      }
      
      // Strategy 4: Check URL patterns that indicate authenticated areas
      const currentUrl = this.page.url();
      if (currentUrl.includes('/dashboard') || 
          currentUrl.includes('/account') || 
          currentUrl.includes('/profile') ||
          currentUrl.includes('/todos')) {
        console.log('URL suggests user is in authenticated area:', currentUrl);
        return true;
      }
      
      // Strategy 5: Check for todos-related content which would indicate successful login
      const todosSelectors = [
        'text=Todo List',
        'text=Add Todo',
        'text=My Todos',
        'button:has-text("Add")',
        '.todo-list',
        '.todo-item',
        '[data-testid="todo-list"]',
        'input[placeholder*="todo"]',
        'input[placeholder*="task"]'
      ];
      
      for (const selector of todosSelectors) {
        const isTodosVisible = await this.page.locator(selector).isVisible().catch(() => false);
        if (isTodosVisible) {
          console.log('Found todos element:', selector);
          return true;
        }
      }
      
      console.log('No login indicators found, user appears to be logged out');
      return false;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }
}

export default AuthPage;
