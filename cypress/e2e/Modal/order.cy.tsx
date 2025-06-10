import { baseUrl, modal, modalCloseButton, ingredients } from './constuctor.cy';

describe('Тестирование оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехватываем и отдаем данные из profile.json
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'profile.json'
    }).as('getUser');

    // Перехватываем POST-запрос и отдаем из order.json
    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit(baseUrl);

    cy.wait('@getIngredients');

    // Устанавливаем refreshToken в localStorage
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken'); // И куки

    cy.wait('@getUser').then(() => {
      cy.log('getUser request completed!');
    });
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Тест создание заказа', () => {
    // Добавляем булку
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093d"] button').click();

    // Добавляем начинку
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"] button').click();

    // Добавляем соус
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"] button').click();

    cy.get('[data-cy="order-button"] button').click();

    cy.get(modal).should('be.visible');

    cy.get(modal).contains('80760').should('exist');

    cy.get(modalCloseButton).click();

    cy.get(modal).should('not.exist');

    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get(ingredients).should('not.contain', 'Говяжий метеорит (отбивная)');
    cy.get(ingredients).should(
      'not.contain',
      'Соус с шипами Антарианского плоскоходца'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
  });
});
