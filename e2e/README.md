# End-to-End Testing for coba-next

This directory contains the E2E test suite for the coba-next project using Playwright. The application uses username-based authentication (not email-based).

## Best Practices

1. **Test Coverage**: Focus on critical user flows rather than testing every small interaction.
2. **Data Management**: Use test fixtures and helper functions to create consistent test data.
3. **Test Isolation**: Each test should be independent and not rely on the state from other tests.
4. **Page Objects**: For complex pages, use the Page Object pattern to encapsulate selectors and actions.
5. **Test Data**: Use unique, generated test data rather than hard-coded values.
6. **Selectors**: Prefer data-testid attributes for selecting elements to make tests resilient to UI changes.
7. **Environment Variables**: Use environment variables for sensitive information like passwords.
8. **Wait Strategically**: Use explicit waits like `toBeVisible()` instead of arbitrary timeouts.

## Structure

- `tests/`: Contains the actual test files
  - `auth.spec.js` - Tests for authentication flows (login, register, logout)
  - `api.spec.js` - Tests for API endpoints
- `pages/`: Page Object Models and API services
  - `auth.page.js` - Authentication page object for login/register interactions
  - `api.service.js` - Service for API testing
- `utils/`: Helper functions and utilities for tests
  - `test-utils.js` - Common test utility functions
  - `custom-assertions.js` - Custom test assertions
- `fixtures/`: Test fixtures and setup/teardown logic
  - `test-fixtures.js` - Test user data and authentication context

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# View the HTML report
npm run test:e2e:report

# Run a specific test file
npx playwright test e2e/tests/home.spec.js

# Run tests in a specific browser
npx playwright test --project=chromium
```

## Environment Setup

Create a `.env.test` file in the project root with the following variables for testing:

```
TEST_USER_USERNAME=testuser
TEST_USER_PASSWORD=your-test-password
```

**Important**: The application uses username-based authentication, not email-based authentication.

## Debugging Tests

1. Use `test.only()` to run a single test
2. Use `npx playwright test --debug` to run in debug mode
3. Use `page.pause()` in your test to pause execution and inspect the browser

## Continuous Integration

Add the following to your CI pipeline:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test
```
