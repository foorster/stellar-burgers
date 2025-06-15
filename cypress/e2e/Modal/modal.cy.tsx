import { baseUrl, modal, modalCloseButton, bunName } from './constuctor.cy';

describe('Тест работы модального окна', () => {
  beforeEach(() => {
    // Перехватываем GET-запрос к API ингредиентов и подменяем ответ данными из json
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit(baseUrl);

    // Ждем пока не будет выполнен перехваченный запрос
    cy.wait('@getIngredients');

    // Кликаем на булку, чтобы открыть модальное окно
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093d"]').click();
  });
  it('Тест открытия модального окна', () => {
    cy.get(modal).should('be.visible');

    cy.get(modal).contains(bunName).should('exist');

    cy.get(modalCloseButton).should('exist');
  });

  it('Тест закрытия модального окна', () => {
    cy.get(modalCloseButton).click();

    // Проверяем, что модальное окно больше не существует
    cy.get(modal).should('not.exist');
  });

  it('Тест закрытия модального окна на оверлей', () => {
    cy.get('[data-cy="modal-close-overlay"]').click({ force: true });

    cy.get(modal).should('not.exist');
  });
});
