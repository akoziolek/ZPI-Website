import { STATUSES } from "../../frontend/src/config";

describe('Display topic use case (UI flow)', () => {
  const checkIfNoExtraButtons = (expectedButtons) => {
    cy.get('[data-testid="action-bar"]')
      .find('button') 
      .should('have.length', expectedButtons.length) 
      .then(($buttons) => {
        const buttonTexts = [...$buttons].map(btn => btn.innerText.trim());

        expect(buttonTexts).to.deep.equal(expectedButtons);
      });
  }

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
    checkIfNoExtraButtons(['Wróć', 'Zatwierdź', 'Odrzuć']);

    cy.contains('Wyloguj się').click();
  });
 
  it('logs in through UI, student displays a topic in submision', () => {
    const STUDENT_EMAIL = 'anna.nowak.234567@pwr.edu.pl';
    const TOPIC_NAME = 'Architektura mikroserwisów w chmurze';

    cy.visit('/');

    cy.contains(STUDENT_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains('button', 'Podpisz');
    checkIfNoExtraButtons(['Wróć', 'Podpisz']);
  
    cy.contains('Wyloguj się').click();
  });

  it('logs in through UI, student displays an approved topic', () => {
    const STUDENT_EMAIL = 'patrycja.kubiak.345688@pwr.edu.pl';
    const TOPIC_NAME = 'Machine Learning dla detekcji oszustw';

    cy.visit('/');

    cy.contains(STUDENT_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains(TOPIC_NAME).should('be.visible'); 
    cy.contains('button', 'Zobacz opinię');

    checkIfNoExtraButtons(['Wróć', 'Zobacz opinię']);
  
    cy.contains('Wyloguj się').click();
  });

  
  
  it('logs in through UI, student displays a rejected topic', () => {
    const STUDENT_EMAIL = 'damian.kruk.390123@pwr.edu.pl';
    const TOPIC_NAME = 'Zastosowanie blockchain w logistyce';

    cy.visit('/');

    cy.contains(STUDENT_EMAIL).click();
    cy.contains('button', /^Zaloguj/i).click();

    cy.url().should('include', '/topics');

    cy.contains(TOPIC_NAME)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.contains('button', 'Zobacz opinię').click();
    checkIfNoExtraButtons(['Wróć', 'Zobacz opinię']);
  
    cy.contains('Wyloguj się').click();
  });

    it('logs in through UI, student displays an open topic', () => {
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
    checkIfNoExtraButtons(['Wróć', 'Zapisz się']);

    cy.contains('Dopisano do tematu!').should('be.visible');

    cy.contains('button', 'Zamknij').click();

    cy.contains('button', 'Wypisz się').click();
    checkIfNoExtraButtons(['Wróć', 'Wypisz się']);

    cy.contains('Wypisano się z tematu!').should('be.visible');

    cy.contains('button', 'Zamknij').click();

    cy.contains('Wyloguj się').click();
  });

});




