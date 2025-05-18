import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import type { TIngredient } from '@utils-types';
import type { RootState } from '../../services/store';

export type Nullable<T> = T | null;
export type StateError = Nullable<string>;
interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: StateError;
}

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch ingredients'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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

export const getIngredientState = (state: RootState) => state.ingredients;

export default ingredientsSlice.reducer;

export const { reducer: ingredientReducer } = ingredientsSlice;
