describe('Join and withdraw topic use case (UI flow)', () => {
  const STUDENT_EMAIL = 'milena.polańska.589014@pwr.edu.pl';
  const TOPIC_NAME = 'Wpływ AI na procesy rekrutacyjne';

  it('logs in through UI, student joins a topic, student withdraws the topic', () => {
    cy.visit('/');

    cy.contains(STUDENT_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains('button', 'Zapisz się').click();

    cy.contains('Dopisano do tematu!').should('be.visible');

    cy.contains('button', 'Zamknij').click();

    cy.contains('button', 'Wypisz się').click();

    cy.contains('Wypisano się z tematu!').should('be.visible');

    cy.contains('button', 'Zamknij').click();

    cy.contains('Wyloguj się').click();
  });
});
