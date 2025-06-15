import { rootReducer } from '../store';
import { configureStore } from '@reduxjs/toolkit';
import { expect, test } from '@jest/globals';

test('Проверка правильной инициализации rootReducer', () => {
  // Определяем экшен с неизвестным типом (чтобы reducer вернул initialState)
  const action = { type: 'UNKNOWN_ACTION' };

  // Создаем стор
  const store = configureStore({
    reducer: rootReducer
  });

  // Получаем состояние, которое возвращает rootReducer при получении undefined state и UNKNOWN_ACTION
  const state = rootReducer(undefined, action);

  // Получаем начальное состояние из стора
  const initialState = store.getState();

  // Проверяем, что состояние, полученное из rootReducer, равно начальному состоянию
  expect(state).toEqual(initialState);
});
