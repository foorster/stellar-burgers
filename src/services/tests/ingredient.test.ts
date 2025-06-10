import ingredientsReducer, {
  getIngredients,
  getIngredientState,
  getIngredientsSelector
} from '../ingredients/slice';
import { getIngredientsApi } from '../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '../../services/store';
import { Ingredients } from './Data/ingredient';

// Мокаем апи
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Тесты для слайса ingredients', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });
  });

  it('При вызове экшена getIngredients.pending, loading меняется на true', () => {
    store.dispatch(getIngredients()); // Диспатчим асинхронный санк
    const state = getIngredientState(store.getState() as RootState);

    expect(state.loading).toBe(true); // Проверяем, что loading стало true
    expect(state.error).toBe(null); // Проверяем, что error равно null
  });

  it('При вызове экшена getIngredients.fulfilled, ингредиенты записываются в стор, loading меняется на false', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(Ingredients);

    await store.dispatch(getIngredients());

    const state = getIngredientState(store.getState() as RootState);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(Ingredients);
    expect(state.error).toBe(null);
  });

  it('При вызове экшена getIngredients.rejected, ошибка записывается в стор, loading меняется на false', async () => {
    const errorMessage = 'Failed to fetch ingredients';
    (getIngredientsApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(getIngredients());

    const state = getIngredientState(store.getState() as RootState);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual([]);
  });

  it('Тест селектора getIngredientsSelector', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(Ingredients);

    await store.dispatch(getIngredients());

    const ingredients = getIngredientsSelector(store.getState() as RootState);
    expect(ingredients).toEqual(Ingredients);
  });
});
