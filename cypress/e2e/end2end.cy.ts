describe('E2E Authentication & Tasks', () => {
  // Generate a unique username each run to avoid conflicts
  const random = Math.floor(Math.random() * 100000);
  const user = {
    username: `testuser${random}`,
    password: 'Password123!',
  };

  it('registers, logs out, fails login, then logs in successfully', () => {
    cy.visit('http://localhost:3000/');

    // 1️⃣ Register
    cy.contains('button', 'Create Account').click();
    cy.get('input[placeholder="Username"]').type(user.username);
    cy.get('input[placeholder="Password"]').type(user.password);
    cy.contains('button', 'Register').click();

    // Wait for auto-login to dashboard
    cy.contains('button', 'Add Task', { timeout: 10000 }).should('be.visible');

    // 2️⃣ Logout via dropdown
    // Open the profile dropdown
    cy.get('div.profile').click();

    // Wait for the Logout button to appear and then click
    cy.get('div.profile-holder button')
      .contains('Logout')           // make sure it's the Logout button
      .should('be.visible')         // wait until visible
      .click();
    cy.contains('button', 'Login', { timeout: 10000 }).should('be.visible');

    // 3️⃣ Attempt login with wrong password
    cy.contains('button', 'Login').click();
    cy.get('input[placeholder="Username"]').type(user.username);
    cy.get('input[placeholder="Password"]').type('WrongPassword!');
    cy.contains('button', 'Sign In').click();

    // Error message should appear
    cy.contains('button', 'Back').click();

    // 4️⃣ Login with correct password
    cy.contains('button', 'Login').click();
    cy.get('input[placeholder="Username"]').clear().type(user.username);
    cy.get('input[placeholder="Password"]').clear().type(user.password);
    cy.contains('button', 'Sign In').click();

    // Dashboard should now be visible
    cy.contains('button', 'Add Task', { timeout: 10000 }).should('be.visible');
  });

  context('Task Management', () => {
    beforeEach(() => {
      // Ensure user is logged in before each task test
      cy.visit('http://localhost:3000/');
      cy.contains('button', 'Login').click();
      cy.get('input[placeholder="Username"]').type(user.username);
      cy.get('input[placeholder="Password"]').type(user.password);
      cy.contains('button', 'Sign In').click();
      cy.contains('button', 'Add Task', { timeout: 10000 }).should('be.visible');
    });

    it('adds a new task', () => {
      cy.contains('button', 'Add Task').click();
      cy.get('input[placeholder="Enter task name"]').type('My New Task');
      cy.get('input[placeholder="Enter task description"]').type('This is a test task.');

      // Set date (calendar input)
      cy.get('input[placeholder="Enter task date"]')
        .invoke('val', '2025-12-15')
        .trigger('change', { force: true });

      cy.get('input[placeholder="Enter task time"]')
        .invoke('val', '10:30')
        .trigger('change', { force: true });

      cy.contains('button', 'Save').click();

      cy.contains('div', 'My New Task').should('be.visible');
      cy.contains('div', 'This is a test task.').should('be.visible');
    });

    it('marks a task as completed', () => {
      cy.contains('button', 'Add Task').click();
      cy.get('input[placeholder="Enter task name"]').type('Complete Me');
      cy.get('input[placeholder="Enter task description"]').type('A task to be completed.');
      cy.get('input[placeholder="Enter task date"]')
        .invoke('val', '2025-12-20')
        .trigger('change', { force: true });
      cy.get('input[placeholder="Enter task time"]')
        .invoke('val', '11:00')
        .trigger('change', { force: true });
      cy.contains('button', 'Save').click();

      cy.contains('.todo', 'Complete Me').within(() => {
        cy.contains('button', 'Mark Complete').click();
      });

      cy.contains('h2', 'Completed Tasks').should('be.visible');
      cy.contains('.completed', 'Complete Me').should('be.visible');
    });

    it('deletes a task', () => {
      cy.contains('button', 'Add Task').click();
      cy.get('input[placeholder="Enter task name"]').type('Delete Me');
      cy.get('input[placeholder="Enter task description"]').type('A task to be deleted.');
      cy.get('input[placeholder="Enter task date"]')
        .invoke('val', '2025-12-25')
        .trigger('change', { force: true });
      cy.get('input[placeholder="Enter task time"]')
        .invoke('val', '12:00')
        .trigger('change', { force: true });
      cy.contains('button', 'Save').click();

      cy.contains('div', 'Delete Me').should('be.visible');

      cy.contains('.todo', 'Delete Me').within(() => {
        cy.contains('button', 'Delete').click();
      });
      cy.contains('h3', 'Are you sure you want to delete this task?').should('be.visible');
      cy.contains('button', 'Yes').click();

      cy.contains('div', 'Delete Me').should('not.exist');
    });
  });
});
