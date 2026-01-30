import { STATUSES, TOPIC_ACTIONS } from "../../frontend/src/config";

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

  const verifyTopicDisplay = (userEmail, topicName, status, people, buttons) => {
    cy.visit('/');
    cy.contains(userEmail).click();
    cy.contains('button', /^Zaloguj/i).click();
    cy.visit('/topics');
    cy.url().should('include', '/topics');

    cy.contains(topicName)
      .closest('tr')
      .within(() => {
        cy.contains('Wyświetl').click();
      });

    cy.get('[data-testid="topic-name"]').contains(topicName);

    cy.get('[data-testid="people-table"]').within(() => {
      people.forEach((person) => {
        cy.contains(person).should('be.visible');
      });
    });

    cy.contains('Opis').should('be.visible');
    cy.contains('span', status).should('be.visible');

    checkIfNoExtraButtons(buttons);
    // SPRAWDZENIE CZY TE PRZYCISKI ISNITEJA

    cy.contains('Wyloguj się').click();
  };
   
  // dla w zlozeniu osobny test na podpisy
  it('logs in through UI, user displays a topic in submission', () => {
    const user_mail = 'iga.piasecka.489014@pwr.edu.pl';
    const topic_name = 'Bezpieczeństwo aplikacji webowych';
    const people = ['Paulina Rutkowska', 'Norbert Kołodziej', 'Karol Szczepański', 'Iga Piasecka'];
    verifyTopicDisplay(user_mail, topic_name, STATUSES.SUBMITTED, people, []);
  });

  // brakuje jednego stanu 
  it('logs in through UI, student displays an approved topic', () => {
    const user_mail = 'patrycja.kubiak.345688@pwr.edu.pl';
    const topic_name = 'Machine Learning dla detekcji oszustw';
    const people = ['Patrycja Kubiak', 'Adrian Bąk', 'Julia Ostrowskai', 'Szymon Urbański', 'Paulina Cieślak'];
    verifyTopicDisplay(user_mail, topic_name, STATUSES.APPROVED, people, ['Wróć', 'Zobacz opinię']);
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

    cy.contains('span', STATUSES.REJECTED).should('be.visible');
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

    cy.contains('span', STATUSES.OPEN).should('be.visible');
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

  it('logs in through UI, student displays an in preperation topic', () => {
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

    cy.contains('span', STATUSES.APPROVED).should('be.visible');
    cy.contains(TOPIC_NAME).should('be.visible'); 
    cy.contains('button', 'Zobacz opinię');

    checkIfNoExtraButtons(['Wróć', 'Zobacz opinię']);
  
    cy.contains('Wyloguj się').click();
  });


});




