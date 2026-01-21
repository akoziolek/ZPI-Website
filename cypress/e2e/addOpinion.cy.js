import { STATUSES } from "../../src/config";

describe('Add positive opinion to a topic use case (UI flow)', () => {
  const USER_EMAIL = 'adam.kot.2@pwr.edu.pl';
  const TOPIC_NAME = 'System rekomendacji oparty na uczeniu maszynowym';

  it('logs in through UI, kpk member approves a topic', () => {
    cy.visit('/');

    cy.contains(USER_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains('button', 'Zatwierdź').click()

    cy.contains('Zatwierdzono temat!').should('be.visible');

    cy.contains('button', 'Zamknij').click();

    cy.contains('span', STATUSES.APPROVED).should('be.visible');

    cy.contains('Wyloguj się').click();
  });
});

describe('Add negative opinion to a topic use case (UI flow)', () => {
  const USER_EMAIL = 'amelia.kot.3@pwr.edu.pl';
  const TOPIC_NAME = 'Aplikacja mobilna wspierająca naukę';

  it('logs in through UI, kpk member rejects a topic', () => {
    cy.visit('/');

    cy.contains(USER_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains('button', 'Odrzuć').click();

    cy.url().should('include', '/opinion');

    cy.get('[data-testid="argumentation-box"]').type('Uzasadnienie odrzucenia tematu');

    cy.contains('button', 'Dodaj').click();

    cy.contains('Odrzucono temat!').should('be.visible');

    cy.contains('button', 'Zamknij').click();

    cy.url().should('include', '/topics');

    cy.contains('span', STATUSES.REJECTED).should('be.visible');

    cy.contains('Wyloguj się').click();
  });
});
