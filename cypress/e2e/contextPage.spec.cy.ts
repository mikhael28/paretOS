Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    cy.contains('Sign In').click()
    cy.get("input[type='text']").type("fqankovi@gmail.com");
    cy.get("input[type='password']").type("12345678");
    cy.contains('Sign In').click()
  })
})