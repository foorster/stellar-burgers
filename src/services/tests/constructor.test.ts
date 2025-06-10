import { describe, expect, test } from '@jest/globals';
import {
  constructorReducer as reducer,
  addIngredient,
  removeIngredient,
  initialState,
  moveIngredientUp
} from '../burger-constructor/slice';

import { Bun, Sauce } from './Data/ingredient';

describe('Проверяем редьюсер слайса burger-constructor', () => {
  test('Тест обработка экшена добавления ингредиента', () => {
    const action = addIngredient(Bun);
    const state = reducer(initialState, action);
    expect(state.constructorItems.bun).toEqual({
      ...Bun,
      id: expect.any(String) // Проверяем, что у булки сгенерирован уникальный айди
    });
  });

  test('Тест обработка экшена удаления ингредиента', () => {
    // Создаем начальное состояние, в котором уже есть один соус
    const initialStateSauce = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [{ ...Sauce, id: '666' }]
      }
    };

    // Создаем экшен для удаления
    const action = removeIngredient('666');

    // Применяем экшен к начальному состоянию с ингредиентом, чтобы получить новое состояние
    const newState = reducer(initialStateSauce, action);

    // Проверяем, что в новом состоянии ингредиентов не
    expect(newState.constructorItems.ingredients.length).toBe(0);
  });

  test('Тест обработка экшена изменения порядка ингредиентов в начинке', () => {
    // Создаем начальное состояние с двумя ингредиентами
    const initialStateSauces = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [
          { ...Sauce, id: '1' },
          { ...Sauce, id: '2' }
        ]
      }
    };

    // Создаем экшен для перемещения ингредиента 2 вверх
    const action = moveIngredientUp('2');

    // Применяем экшен к начальному состоянию, чтобы получить новое состояние
    const state = reducer(initialStateSauces, action);

    // Проверяем, что ингредиенты поменялись местами
    expect(state.constructorItems.ingredients[0].id).toBe('2');
    expect(state.constructorItems.ingredients[1].id).toBe('1');
  });
});
