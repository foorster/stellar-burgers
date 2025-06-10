import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '@utils-types';
import type { RootState } from '../../services/store';

// Интерфейс для состояния ингредиентов
interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние ингредиентов
const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

// Асинхронный санк для получения списка ингредиентов
export const getIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/getIngredients', // Уникальный идентификатор санка
  async (_, { rejectWithValue }) => {
    try {
      const result = await getIngredientsApi(); // Запрашиваем ингредиенты с сервера
      return result;
    } catch (error) {
      console.error('getIngredients: createAsyncThunk - ERROR:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch ingredients'; // Получаем сообщение об ошибке
      return rejectWithValue(errorMessage); // Отклоняем санк с сообщением об ошибке
    }
  }
);

// Создаем slice для управления состоянием ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Обрабатываем состояния асинхронного санка
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
        state.error = null;
      });
  }
});

// Селектор для получения состояния ингредиентов из корневого состояния
export const getIngredientState = (state: RootState) => state.ingredients;

export default ingredientsSlice.reducer;

export const getIngredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;
