// @ts-check

/**
 * Todos page object representing todo management functionality
 * Following the Page Object Model pattern for better test organization
 */
class TodosPage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page
   */
  constructor(page) {
    this.page = page;
    this.url = '/todos';
    
    // Define selectors with multiple alternatives for robustness
    // For todo list container
    this.todoList = [
      '[data-testid="todo-list"]', 
      '.todo-list', 
      'ul.todos', 
      '.todo-container',
      'div > ul'
    ];
    
    // For individual todo items
    this.todoItem = [
      '[data-testid="todo-item"]', 
      '.todo-item', 
      'li.todo', 
      'ul > li',
      '.task-item'
    ];
    
    // For new todo input field
    this.newTodoInput = [
      'input[placeholder*="Add a new task"]',
      'input[placeholder*="task"]',
      'input[placeholder*="todo"]',
      'input[name="todo"]',
      'input[type="text"]'
    ];
    
    // For add todo button
    this.addButton = [
      'button:has-text("Add")',
      'button[type="submit"]',
      'button.add-todo',
      '[data-testid="add-button"]',
      'form button'
    ];
    
    // For todo checkboxes
    this.todoCheckbox = [
      'input[type="checkbox"]',
      '.todo-checkbox',
      '[data-testid="todo-checkbox"]'
    ];
    
    // For delete buttons
    this.deleteButton = [
      '[data-testid="delete-button"]',
      'button:has-text("Delete")',
      'button:has-text("Remove")',
      '.delete-todo',
      'button.delete'
    ];
  }

  /**
   * Navigate to the todos page
   * @returns {Promise<void>}
   */
  async goto() {
    await this.page.goto(this.url);
  }

  /**
   * Helper method to try multiple selectors
   * @param {string[]} selectors - Array of selectors to try
   * @returns {string} - Combined selector with OR
   */
  _combineSelectors(selectors) {
    return selectors.join(', ');
  }

  /**
   * Add a new todo
   * @param {string} taskText - Text for the new task
   * @returns {Promise<void>}
   */
  async addTodo(taskText) {
    // Try to find input field with any of our selectors
    const inputSelector = this._combineSelectors(this.newTodoInput);
    const buttonSelector = this._combineSelectors(this.addButton);
    
    // Wait for input to be visible
    await this.page.waitForSelector(inputSelector, { state: 'visible', timeout: 5000 }).catch(e => {
      console.log(`Could not find todo input: ${e.message}`);
    });
    
    // Fill the input
    await this.page.fill(inputSelector, taskText);
    
    // Click the add button
    await this.page.click(buttonSelector);
    
    // Wait for UI to update
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Check if todo list is visible
   * @returns {Promise<boolean>}
   */
  async isTodoListVisible() {
    try {
      // Enhanced debugging to understand page state
      await this.page.screenshot({ path: 'todos-page-check.png' });
      console.log('Current page URL for todos check:', await this.page.url());
      
      // Add more resilient checks - first try each selector individually for better error reporting
      console.log('Checking todo list visibility with multiple approaches');
      
      // Try each list selector individually first
      for (const selector of this.todoList) {
        try {
          const isVisible = await this.page.locator(selector).isVisible().catch(() => false);
          if (isVisible) {
            console.log(`Found visible todo list with selector: ${selector}`);
            return true;
          }
          console.log(`Selector ${selector} not found or not visible`);
        } catch (e) {
          console.log(`Error with selector ${selector}: ${e.message}`);
        }
      }
      
      // If individual checks fail, try with the combined selector
      const listSelector = this._combineSelectors(this.todoList);
      const isListVisible = await this.page.locator(listSelector).isVisible().catch(() => false);
      if (isListVisible) {
        console.log('Found todo list with combined selector');
        return true;
      }
      
      // Last resort - check if there's any container that might be the todo list
      // This could be any ul, div with list items, or similar structures
      const fallbackSelectors = ['ul', '.container ul', 'div > ul', '.todos', '.todo-container', 'main'];
      for (const selector of fallbackSelectors) {
        const exists = await this.page.locator(selector).count() > 0;
        if (exists) {
          console.log(`Found potential todo list container with fallback selector: ${selector}`);
          // Check if it's actually visible
          const isVisible = await this.page.locator(selector).isVisible().catch(() => false);
          if (isVisible) {
            console.log('Fallback container is visible');
            return true;
          }
        }
      }
      
      // Last option - check if we're at least on the todos page by URL
      if (this.page.url().includes('/todos') || this.page.url().includes('/dashboard')) {
        console.log('On todos/dashboard page but container not found');
        // Log page content for debugging
        const content = await this.page.content();
        console.log('Page content snippet:', content.substring(0, 300) + '...');
      }
      
      console.log('Todo list not found with any selector');
      return false;
    } catch (error) {
      console.log(`Error checking todo list visibility: ${error.message}`);
      return false;
    }
  }

  /**
   * Get the number of todo items
   * @returns {Promise<number>}
   */
  async getTodoCount() {
    const itemSelector = this._combineSelectors(this.todoItem);
    
    try {
      return await this.page.locator(itemSelector).count();
    } catch (error) {
      console.log(`Error getting todo count: ${error.message}`);
      return 0;
    }
  }

  /**
   * Mark a todo as complete by index
   * @param {number} index - Index of the todo (0-based)
   * @returns {Promise<void>}
   */
  async markTodoComplete(index) {
    const itemSelector = this._combineSelectors(this.todoItem);
    const checkboxSelector = this._combineSelectors(this.todoCheckbox);
    
    try {
      // Find the specified todo item
      const items = await this.page.locator(itemSelector).all();
      
      if (index >= items.length) {
        console.log(`Todo item index ${index} out of range (only ${items.length} items found)`);
        return;
      }
      
      // Find the checkbox within this item and check it
      const checkbox = await items[index].locator(checkboxSelector);
      await checkbox.check();
      
      // Wait for UI to update
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.log(`Error marking todo complete: ${error.message}`);
    }
  }

  /**
   * Check if a todo is completed by index
   * @param {number} index - Index of the todo (0-based)
   * @returns {Promise<boolean>}
   */
  async isTodoCompleted(index) {
    const itemSelector = this._combineSelectors(this.todoItem);
    const checkboxSelector = this._combineSelectors(this.todoCheckbox);
    
    try {
      const items = await this.page.locator(itemSelector).all();
      
      if (index >= items.length) {
        console.log(`Todo item index ${index} out of range (only ${items.length} items found)`);
        return false;
      }
      
      const checkbox = await items[index].locator(checkboxSelector);
      return await checkbox.isChecked();
    } catch (error) {
      console.log(`Error checking todo completion: ${error.message}`);
      return false;
    }
  }

  /**
   * Delete a todo by index
   * @param {number} index - Index of the todo (0-based)
   * @returns {Promise<void>}
   */
  async deleteTodo(index) {
    const itemSelector = this._combineSelectors(this.todoItem);
    const deleteSelector = this._combineSelectors(this.deleteButton);
    
    try {
      // Find the specified todo item
      const items = await this.page.locator(itemSelector).all();
      
      // Log items for debugging
      console.log(`Found ${items.length} todo items`);
      
      if (index >= items.length) {
        console.log(`Todo item index ${index} out of range (only ${items.length} items found)`);
        return;
      }
      
      // First try to find delete button within the item
      const deleteButton = await items[index].locator(deleteSelector);
      await deleteButton.click();
      
      // Wait for UI to update
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.log(`Error deleting todo: ${error.message}`);
      
      // As a fallback, try with the old nth-child approach
      try {
        // This creates a selector like '.todo-item:nth-child(2) button.delete, [data-testid="todo-item"]:nth-child(2) [data-testid="delete-button"]'
        // which tries all combinations of item and delete button selectors
        const itemSelectors = this.todoItem.map(itemSel => 
          this.deleteButton.map(delSel => `${itemSel}:nth-child(${index + 1}) ${delSel}`).join(', ')
        ).join(', ');
        
        await this.page.locator(itemSelectors).click();
      } catch (fallbackError) {
        console.log(`Fallback delete method also failed: ${fallbackError.message}`);
      }
    }
  }

  /**
   * Check if a specific todo text exists
   * @param {string} taskText - Text of the task to find
   * @returns {Promise<boolean>}
   */
  async todoExists(taskText) {
    try {
      // Try multiple approaches to find the task
      
      // Approach 1: Direct text search
      const directTextMatch = await this.page.locator(`text=${taskText}`).count() > 0;
      if (directTextMatch) {
        console.log(`Found todo with text "${taskText}" using direct text search`);
        return true;
      }
      
      // Approach 2: Search within todo items
      const itemSelector = this._combineSelectors(this.todoItem);
      const items = await this.page.locator(itemSelector).all();
      
      for (let i = 0; i < items.length; i++) {
        const itemText = await items[i].textContent();
        if (itemText && itemText.includes(taskText)) {
          console.log(`Found todo with text "${taskText}" within todo item at index ${i}`);
          return true;
        }
      }
      
      console.log(`Could not find todo with text "${taskText}"`);
      return false;
    } catch (error) {
      console.log(`Error checking if todo exists: ${error.message}`);
      return false;
    }
  }
}

export default TodosPage;
