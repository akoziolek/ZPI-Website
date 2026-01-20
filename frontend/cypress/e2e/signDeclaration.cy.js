describe('Sign Declaration use case (UI flow)', () => {
  const STUDENT_EMAIL = 'anna.nowak.234567@pwr.edu.pl';
  const PREPARING_STATUS_LABEL = 'W przygotowaniu do złożenia wniosku';

  it('logs in through UI, opens a PREPARING topic and signs its declaration', () => {
    // Visit the app (root redirects to login when unauthenticated)
    cy.visit('/');

    // Wait for users list and select seeded student by email
    cy.contains(STUDENT_EMAIL).click();

    // Click login button
    cy.contains('button', /^Zaloguj/i).click();

    // After login we should be on /topics
    cy.url().should('include', '/topics');

    // Find a topic row that has PREPARING status and click its 'Wyświetl' link
    cy.contains('span', PREPARING_STATUS_LABEL)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    // On topic page, click the 'Podpisz' action button
    cy.contains('button', 'Podpisz').click();

    // Assert success notification appears
    cy.contains('Podpisano deklarację!').should('be.visible');
  });
});
