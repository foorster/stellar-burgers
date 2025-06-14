export const baseUrl = 'http://localhost:4000';
export const modal = '[data-cy="modal"]';
export const modalCloseButton = '[data-cy="modal-close-button"]';
export const bunName = 'Флюоресцентная булка R2-D3';

export const ingredients = '[data-cy="ingedients-in-constructor"]';

beforeEach(() => {
  // Перехватываем GET-запрос к API ингредиентов и подменяем ответ данными из json
  cy.intercept('GET', 'api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  cy.visit(baseUrl);

  // Ждем пока не будет выполнен перехваченный запрос
  cy.wait('@getIngredients');
});

describe('Тест конструктора', () => {
  it('Тест добавление ингридиентов', () => {
    // Добавляем булку
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093d"] button').click();

    // Добавляем начинку
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"] button').click();

    // Добавляем соус
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"] button').click();

    // Проверяем, что верхняя часть добавлена
    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );

    // Проверяем, что начинка добавлена
    cy.get(ingredients).should('contain', 'Биокотлета из марсианской Магнолии');

    // Проверяем, что соус добавлен
    cy.get(ingredients).should('contain', 'Соус Spicy-X');

    // Проверяем, что нижняя часть добавлена
    cy.get('[data-cy="constructor-bun-bottom"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
  });
});
