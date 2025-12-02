describe('E2E Tests', () => {
  // Using a unique username for each test run to avoid conflicts with existing users.
  // This is a workaround because we cannot clean up the user in the database before the test.
  const random = Math.floor(Math.random() * 100000);
  const user = {
    username: `testuser${random}`,
    password: 'Password123!',
  };

  // Note: The ideal approach is to have a `before()` hook to reset the database state.
  // This would involve clearing the test user from the database.
  // Since the API endpoint for user deletion is not available, we will proceed
  // with a unique user for each run. This means tests are not fully idempotent.

  context('Account Creation and Login', () => {
    it('allows a user to create an account', () => {
      cy.visit('http://localhost:3000/');
      cy.contains('button', 'Create Account').click();

      // Use placeholder to select the input fields
      cy.get('input[placeholder="Username"]').type(user.username);
      cy.get('input[placeholder="Password"]').type(user.password);

      // Click the "Register" button in the modal
      cy.contains('button', 'Register').click();

      // After registration, the user should be logged in or redirected.
      // Looking for a welcome message or dashboard element.
      // Based on the app's behavior, it seems the user is taken back to the main screen.
      // We will now try to log in with the new account.
      cy.contains('button', 'Login').should('be.visible');
    });

    it('allows a user to log in and see their dashboard', () => {
      // First, create the user to ensure the login test can run independently
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/register', // Assuming this is the registration endpoint
        body: {
          name: user.username,
          password: user.password,
        },
        failOnStatusCode: false // Don't fail if the user already exists from a previous failed run
      });

      cy.visit('http://localhost:3000/');
      cy.contains('button', 'Login').click();

      cy.get('input[placeholder="Username"]').type(user.username);
      cy.get('input[placeholder="Password"]').type(user.password);

      cy.contains('button', 'Sign In').click();

      // Check for a dashboard element to confirm login was successful
      cy.contains('button', 'Add Task').should('be.visible');
    });
  });

  context('Task Management', () => {
    beforeEach(() => {
      // Log in before each test in this context
      cy.visit('http://localhost:3000/');
      cy.contains('button', 'Login').click();
      cy.get('input[placeholder="Username"]').type(user.username);
      cy.get('input[placeholder="Password"]').type(user.password);
      cy.contains('button', 'Sign In').click();
      cy.contains('button', 'Add Task').should('be.visible');
    });

    it('allows a user to add a task', () => {
      cy.contains('button', 'Add Task').click();
      cy.get('input[placeholder="Enter task name"]').type('My New Task');
      cy.get('input[placeholder="Enter task description"]').type('This is a test task.');
      // Date handling might need adjustment based on the date picker component
      cy.get('input[placeholder="Enter task date"]').type('2025-12-15');
      cy.get('input[placeholder="Enter task time"]').type('10:30');


      cy.contains('button', 'Save').click();

      cy.contains('div', 'My New Task').should('be.visible');
      cy.contains('div', 'This is a test task.').should('be.visible');
    });

    it('allows a user to mark a task as completed', () => {
        // First add a task to be marked as complete
        cy.contains('button', 'Add Task').click();
        cy.get('input[placeholder="Enter task name"]').type('Complete Me');
        cy.get('input[placeholder="Enter task description"]').type('A task to be completed.');
        cy.get('input[placeholder="Enter task date"]').type('2025-12-20');
        cy.get('input[placeholder="Enter task time"]').type('11:00');
        cy.contains('button', 'Save').click();


        // Find the task and mark it as complete
        cy.contains('.todo', 'Complete Me').within(() => {
            cy.contains('button', 'Mark Complete').click();
        });

        // Verify the task is in the completed list
        cy.contains('h2', 'Completed Tasks').should('be.visible');
        cy.contains('.completed', 'Complete Me').should('be.visible');
    });


    it('allows a user to delete a task', () => {
        // First add a task to be deleted
        cy.contains('button', 'Add Task').click();
        cy.get('input[placeholder="Enter task name"]').type('Delete Me');
        cy.get('input[placeholder="Enter task description"]').type('A task to be deleted.');
        cy.get('input[placeholder="Enter task date"]').type('2025-12-25');
        cy.get('input[placeholder="Enter task time"]').type('12:00');
        cy.contains('button', 'Save').click();

        cy.contains('div', 'Delete Me').should('be.visible');

        // Find the task and delete it
        cy.contains('.todo', 'Delete Me').within(() => {
            cy.contains('button', 'Delete').click();
        });
        
        cy.contains('h3', 'Are you sure you want to delete this task?').should('be.visible');
        cy.contains('button', 'Yes').click();


        cy.contains('div', 'Delete Me').should('not.exist');
    });
  });

});
