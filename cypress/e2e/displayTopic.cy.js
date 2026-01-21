import { STATUSES } from "../../frontend/src/config";

describe('Display topic use case (UI flow)', () => {
  const USER_EMAIL = 'adam.kot.2@pwr.edu.pl';
  const TOPIC_NAME = 'Analiza wydajności aplikacji webowych';
  const PEOPLE = ['Joanna Szymańska', 'Bartosz Woźniak', 'Alicja Dąbrowska'];

  it('logs in through UI, user displays a topic', () => {
    cy.visit('/');

    cy.contains(USER_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.get('[data-testid="topic-name"]').contains(TOPIC_NAME);

    cy.get('[data-testid="people-table"]').within(() => {
      PEOPLE.forEach((word) => {
        cy.contains(word).should('be.visible')
      })
    })

    cy.contains('Opis').should('be.visible');

    cy.contains('span', STATUSES.SUBMITTED).should('be.visible');

    cy.contains('button', 'Zatwierdź').should('be.visible');

    cy.contains('button', 'Odrzuć').should('be.visible');

    cy.contains('Wyloguj się').click();
  });
});
