const baseUrl = 'http://localhost:4000';
const modal = '[data-cy="modal"]';
const modalCloseButton = '[data-cy="modal-close-button"]';
const bunName = 'Флюоресцентная булка R2-D3';

const ingredients = '[data-cy="ingedients-in-constructor"]';

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

describe('Тест работы модального окна', () => {
  beforeEach(() => {
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

    // Проверяем, что модальное окно больше не существует на странице
    cy.get(modal).should('not.exist');
  });

  it('Тест закрытия модального окна на оверлей', () => {
    cy.get('[data-cy="modal-close-overlay"]').click({ force: true });

    cy.get(modal).should('not.exist');
  });
});
