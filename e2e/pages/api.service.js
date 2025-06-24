// @ts-check

/**
 * API service for e2e testing API endpoints
 * This follows the Service Object Pattern, similar to Page Object Model but for APIs
 */
class ApiService {
  /**
   * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context
   */
  constructor(request) {
    this.request = request;
    this.baseUrl = '/api';
  }

  /**
   * Get all users
   * @param {string} token - Optional auth token
   * @returns {Promise<Object>} Response data
   */
  async getAllUsers(token) {
    /** @type {Record<string, string>} */
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await this.request.get(`${this.baseUrl}/users`, {
      headers
    });
    
    return {
      ok: response.ok(),
      status: response.status(),
      data: await response.json().catch(() => null)
    };
  }

  /**
   * Get a user by ID
   * @param {string|number} id - User ID
   * @returns {Promise<Object>} Response data
   */
  async getUserById(id) {
    const response = await this.request.get(`${this.baseUrl}/users/${id}`);
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
      ok: response.ok()
    };
  }

  /**
   * Attempt to login with credentials
   * @param {string} username - Username
   * @param {string} password - User password
   * @returns {Promise<Object>} Response data
   */
  async login(username, password) {
    const response = await this.request.post(`${this.baseUrl}/auth/login`, {
      data: {
        username,
        password
      }
    });
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
      ok: response.ok()
    };
  }

  /**
   * Create a new user
   * @param {Object} userData - User data with username, password, and rePassword
   * @returns {Promise<Object>} Response data
   */
  async createUser(userData) {
    // Use the register endpoint for user creation
    const response = await this.request.post(`${this.baseUrl}/auth/register`, {
      data: {
        username: userData.username,
        password: userData.password,
        rePassword: userData.rePassword || userData.password
      }
    });
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
      ok: response.ok()
    };
  }
}

export default ApiService;
