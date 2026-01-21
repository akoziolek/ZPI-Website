import { STATUSES } from "../../src/config";

describe('Sign Declaration use case (UI flow)', () => {
  const STUDENT_EMAILS = [
    'anna.nowak.234567@pwr.edu.pl',
    'piotr.zieliński.345678@pwr.edu.pl',
    'katarzyna.wójcik.456789@pwr.edu.pl'
  ];
  const TOPIC_NAME = 'Architektura mikroserwisów w chmurze';

  it('logs in through UI, each student signs the declaration and final status becomes SUBMITTED', () => {
    cy.wrap(STUDENT_EMAILS).each((email, index, list) => {
      cy.visit('/');

      cy.contains(email).click();
      cy.contains('button', /^Zaloguj/i).click();

      cy.url().should('include', '/topics');

      cy.contains(TOPIC_NAME)
        .closest('tr')
        .within(() => {
          cy.contains('Wyświetl').click();
        });

      cy.contains('button', 'Podpisz').click();

      cy.contains('Podpisano deklarację!').should('be.visible');

      cy.contains('button', 'Zamknij').click();

      if (index < list.length - 1) {
        cy.contains('Wyloguj się').click();
      }
    }).then(() => {
      cy.contains('span', STATUSES.SUBMITTED).should('be.visible');
      cy.contains('Wyloguj się').click();
    });
  });
});
