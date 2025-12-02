describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

describe("Authentication", () => {
  it("can sign up and sign in", () => {
    cy.visit("http://localhost:3000");

    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign Up").click();

    cy.url().should("include", "/login");

    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign In").click();

    cy.url().should("include", "/dashboard");
  });
});
