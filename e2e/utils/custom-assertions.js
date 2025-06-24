// @ts-check
import { expect } from '@playwright/test';

/**
 * Custom assertions to extend Playwright's expect functionality
 */

/**
 * Extends Playwright's expect with custom matchers
 */
export function extendExpect() {
  // Add custom matchers to Playwright's expect
  expect.extend({
    /**
     * Custom matcher to check if an element has a specific attribute containing a value
     * @param {import('@playwright/test').Locator} received - Playwright locator
     * @param {string} attribute - Attribute name
     * @param {string} value - Value to check for
     * @returns {Promise<{pass: boolean, message: () => string}>} Result object
     */
    async toHaveAttributeContaining(received, attribute, value) {
      const attributeValue = await received.getAttribute(attribute);
      const pass = attributeValue?.includes(value) ?? false;
      
      return {
        pass,
        message: () => pass
          ? `Expected element not to have attribute ${attribute} containing ${value}, but it does.`
          : `Expected element to have attribute ${attribute} containing ${value}, but got ${attributeValue}.`
      };
    },
    
    /**
     * Custom matcher to check if an element is visible and enabled
     * @param {import('@playwright/test').Locator} received - Playwright locator
     * @returns {Promise<{pass: boolean, message: () => string}>} Result object
     */
    async toBeInteractive(received) {
      const isVisible = await received.isVisible();
      const isEnabled = await received.isEnabled();
      const pass = isVisible && isEnabled;
      
      return {
        pass,
        message: () => pass
          ? `Expected element not to be interactive, but it is visible and enabled.`
          : `Expected element to be interactive (visible and enabled), but it is ${!isVisible ? 'not visible' : 'not enabled'}.`
      };
    }
  });
}

// Initialize the custom assertions
extendExpect();
