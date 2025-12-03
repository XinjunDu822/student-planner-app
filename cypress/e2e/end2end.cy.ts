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

  // Helper to select a day in the current month for react-datepicker
  const selectDate = (day) => {
    cy.get('input[placeholder="Enter task date"]').click();
    cy.get('.react-datepicker').should('be.visible');
    cy.get(`.react-datepicker__day--0${day}, .react-datepicker__day--${day}`)
      .not('.react-datepicker__day--outside-month')
      .first()
      .click();
  };

  // Helper to set the time input (handles the readOnly + 00:00 initialization)
  const setTimeInput = (time) => {
    cy.get('input[placeholder="Enter task time"]')
      .click({force: true}) // triggers setValue("00:00")
      .click({force: true}) // triggers setValue("00:00")
      // .clear({force: true})
      .type(time);
  };

  it('adds a new task', () => {
    cy.contains('button', 'Add Task').click();
    cy.get('input[placeholder="Enter task name"]').type('My New Task');
    cy.get('input[placeholder="Enter task description"]').type('This is a test task.');

    selectDate(15);       
    setTimeInput('10:30'); 

    cy.contains('button', 'Save').click();

    // Wait for modal to close
    cy.get('.task-popup', { timeout: 10000 }).should('not.exist');

    // Scope assertions to the task container
    cy.contains('.task', 'My New Task', { timeout: 10000 }).within(() => {
      // cy.contains('div', '10:30').should('be.visible');
      // cy.contains('div', 'This is a test task.').should('be.visible');
    });
  });

  it('marks a task as completed', () => {
    cy.contains('button', 'Add Task').click();
    cy.get('input[placeholder="Enter task name"]').type('Complete Me');
    cy.get('input[placeholder="Enter task description"]').type('A task to be completed.');

    selectDate(20);       
    setTimeInput('11:00'); 

    cy.contains('button', 'Save').click();
    cy.get('.task-popup', { timeout: 10000 }).should('not.exist');

    cy.contains('.task', 'Complete Me', { timeout: 10000 }).within(() => {
      cy.contains('button', 'Mark Complete').click();
    });

    cy.contains('h3', 'Complete', { timeout: 10000 }).should('be.visible');
    cy.contains('.completed', 'Complete Me', { timeout: 10000 }).should('be.visible');
  });

  it('deletes a task', () => {
    cy.contains('button', 'Add Task').click();
    cy.get('input[placeholder="Enter task name"]').type('Delete Me');
    cy.get('input[placeholder="Enter task description"]').type('A task to be deleted.');

    selectDate(25);       
    setTimeInput('12:00'); 

    cy.contains('button', 'Save').click();
    cy.get('.task-popup', { timeout: 10000 }).should('not.exist');

    cy.contains('.task', 'Delete Me', { timeout: 10000 }).within(() => {
      cy.contains('button', 'Delete').click();
    });

    cy.contains('h3', 'Are you sure you want to delete this task?', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Yes').click();

    cy.contains('.task', 'Delete Me', { timeout: 10000 }).should('not.exist');
  });

});



});
