import { STATUSES } from "../../frontend/src/config";

describe('Sign Declaration use case (UI flow)', () => {
  const STUDENT_EMAILS = [
    { 'email': 'anna.nowak.234567@pwr.edu.pl', 'name': 'Anna Nowak' },
    { 'email': 'piotr.zieliński.345678@pwr.edu.pl','name': 'Piotr Zieliński' },
    { 'email': 'katarzyna.wójcik.456789@pwr.edu.pl', 'name': 'Katarzyna Wójcik' }
  ];
  const TOPIC_NAME = 'Architektura mikroserwisów w chmurze';

  it('logs in through UI, each student signs the declaration and final status becomes SUBMITTED', () => {
    cy.wrap(STUDENT_EMAILS).each((student_data, index, list) => {
      cy.visit('/');

      cy.contains(student_data['email']).click();
      cy.contains('button', /^Zaloguj/i).click();

      cy.url().should('include', '/topics');

      cy.contains(TOPIC_NAME)
        .closest('tr')
        .within(() => {
          cy.contains('Wyświetl').click();
        });

      cy.contains('span', STATUSES.PREPARING).should('be.visible');

      cy.contains('button', 'Podpisz').click();

      cy.contains('Podpisano deklarację!').should('be.visible');

      cy.contains('button', 'Zamknij').click();

      if (index < list.length - 1) {
        cy.get(`[data-testid="signatures-table"]`).contains(student_data['name']).should('be.visible');

        cy.contains('Wyloguj się').click();
      }
    }).then(() => {
      cy.contains('span', STATUSES.SUBMITTED).should('be.visible');

      cy.visit('/topics');
      cy.get(`[data-testid="topic-row-${TOPIC_NAME}"]`)
        .should('contain', STATUSES.SUBMITTED); 

      cy.contains('Wyloguj się').click();
    });
  });
});
