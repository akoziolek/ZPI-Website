import { STATUSES } from "../../frontend/src/config";

describe('Topic Review Use Cases (Combined Flows)', () => {

  it('should complete full approval flow: approve topic, verify modal, and check persistence', () => {
    const USER_EMAIL = 'adam.kot.2@pwr.edu.pl';
    const TOPIC_NAME = 'System rekomendacji oparty na uczeniu maszynowym';

    cy.visit('/');
    cy.contains(USER_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();
    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains('span', STATUSES.SUBMITTED).should('be.visible');
    cy.contains('button', 'Zatwierdź').click();

    cy.contains('Zatwierdzono temat!').should('be.visible');
    cy.contains('button', 'Zamknij').should('be.visible');

    cy.contains('button', 'Zamknij').click();
    cy.url().should('include', '/topics');
    cy.contains('span', STATUSES.APPROVED).should('be.visible');

    cy.visit('/topics');
    cy.get(`[data-testid="topic-row-${TOPIC_NAME}"]`)
      .should('contain', STATUSES.APPROVED);

    cy.contains('Wyloguj się').click();
  });

  it('should complete full rejection flow: validate form, submit long argumentation, and check persistence', () => {
    const USER_EMAIL = 'amelia.kot.3@pwr.edu.pl';
    const TOPIC_NAME = 'Aplikacja mobilna wspierająca naukę';
    const LONG_REASON = 'To jest bardzo długa i szczegółowa argumentacja odrzucenia tematu. '.repeat(10); 

    cy.visit('/');
    cy.contains(USER_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();
    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains('span', STATUSES.SUBMITTED).should('be.visible');
    cy.contains('button', 'Odrzuć').click();
    
    cy.url().should('include', '/opinion');
    cy.contains('h2', 'Odrzucenie tematu').should('be.visible');
    cy.contains('td', TOPIC_NAME).should('be.visible');

    
    cy.get('[data-testid="argumentation-box"] textarea')
      .should('be.visible')
      .and('be.empty');

    cy.contains('button', 'Dodaj').should('be.visible');

    cy.get('[data-testid="argumentation-box"] textarea')
      .type(LONG_REASON, { delay: 0 }); 

    cy.contains('button', 'Dodaj').click();

    cy.contains('button', 'Zamknij').should('be.visible').click();

    cy.url().should('not.include', '/opinion'); 
    
    cy.visit('/topics');
    
    cy.contains('tr', TOPIC_NAME)
      .should('contain', STATUSES.REJECTED);

    cy.reload();
    cy.contains('tr', TOPIC_NAME)
      .should('contain', STATUSES.REJECTED);

    cy.contains('Wyloguj się').click();
  });

  it('should navigate back to topic details when Back button is clicked', () => {
    const USER_EMAIL = 'amelia.kot.3@pwr.edu.pl';
    const TOPIC_NAME = 'Automatyzacja testów aplikacji';
    cy.visit('/');

    cy.contains(USER_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.visit('/topics');
    
    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });
    
    cy.url().then((detailsUrl) => {
        
        cy.contains('span', STATUSES.SUBMITTED).should('be.visible');
        cy.contains('button', 'Odrzuć').click();
        
        cy.url().should('include', '/opinion');

        cy.get('[data-testid="argumentation-box"] textarea').should('be.empty');

        cy.contains('Wróć').closest('button').click();

        cy.url().should('eq', detailsUrl);
    });
  });
});