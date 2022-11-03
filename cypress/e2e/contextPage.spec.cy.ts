/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
})

beforeEach(() => {
  cy.visit('http://localhost:5173/');
  cy.contains('Sign In').click();
  cy.get("input[type='text']").type("fqankovi@gmail.com");
  cy.get("input[type='password']").type("12345678");
  cy.contains('Sign In').click();
  cy.wait(10000);
  cy.contains('Library of Context').click();
  cy.wait(5000);
  cy.contains('React.js').click();
  cy.wait(5000);
})

describe('Test ContextPage component', () => {
  it('Has the right title', () => {
    cy.contains('It started with the web, but it spread to mobile phones - React is the most effective way of creating digital experiences in 2019.')
  });

  it('Opens ContextObject', () => {
    cy.contains('Redux Toolkit').click();
    cy.wait(5000);
    cy.contains('Open External Link');
  });

  it('Opens overview', () => {
    cy.contains('Read Overview').click();
    cy.contains('Front-end development refers to the code that creates the client experience - the interface that your users will interact with. Even though we are taking the ‘Full-Stack JavaScript’ approach, this doesn’t immediately help us pick out which framework to use. Search online, and you will find fierce debates between React, Vue, Angular & a variety of smaller, less popular solutions. JQuery, released in 2006, is still deployed in production across wide swathes of the internet. WordPress is huge.');
  });

  it('Renders modal', () => {
    cy.get('img[alt="Context page tour"]').click();
    cy.contains("There are three parts of the Library of Context - curated resources on React, Node.js and Amazon Web Services in 'Technical Training'. In 'Finding Work', these resources will give you insights into popular job boards, how to effectively conduct a job search, start a new start-up, or learn about digital nomadism. The final is the 'City Guide', where we lay out information about the tech scene in a given city or region- for example, what start-up incubators, Meetups, venture capital firms, coding bootcamps and companies are located there? To switch between the cateogories, simply tap on each one.");
  });

  it('Suggest new resource', () => {
    cy.contains('Suggest New Resource').click();
    cy.contains('Please enter details');
    cy.contains('Summary');
    cy.contains('Website Link');
    cy.contains('Type');
    cy.get('button').contains('Submit Suggestion');
  });
})