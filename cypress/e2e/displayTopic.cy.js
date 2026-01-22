import { STATUSES } from "../../frontend/src/config";

describe('Display topic use case (UI flow)', () => {
  it('logs in through UI, user displays a topic', () => {
    const USER_EMAIL = 'adam.kot.2@pwr.edu.pl';
    const TOPIC_NAME = 'Analiza wydajności aplikacji webowych';
    const PEOPLE = ['Joanna Szymańska', 'Bartosz Woźniak', 'Alicja Dąbrowska'];

    cy.visit('/');
    cy.contains(USER_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();
    cy.visit('/topics');
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


  it('logs in through UI, student joins a topic, student withdraws the topic', () => {
    const STUDENT_EMAIL = 'milena.polańska.589014@pwr.edu.pl';
    const TOPIC_NAME = 'Wpływ AI na procesy rekrutacyjne';
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




