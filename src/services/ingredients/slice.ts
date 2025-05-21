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
    console.log('getIngredients: createAsyncThunk - STARTED');
    try {
      console.log(
        'getIngredients: createAsyncThunk - Calling getIngredientsApi'
      );
      const result = await getIngredientsApi();
      console.log(
        'getIngredients: createAsyncThunk - getIngredientsApi returned:',
        result
      );
      return result;
    } catch (error) {
      console.error('getIngredients: createAsyncThunk - ERROR:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch ingredients';
      console.log(
        'getIngredients: createAsyncThunk - Rejecting with value:',
        errorMessage
      );
      return rejectWithValue(errorMessage);
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
        console.log('getIngredients.pending - Action dispatched');
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        console.log(
          'getIngredients.rejected - Action dispatched, payload:',
          action.payload
        );
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        console.log(
          'getIngredients.fulfilled - Action dispatched, payload:',
          action.payload
        );
        state.loading = false;
        state.ingredients = action.payload;
        state.error = null;
      });
  }
});

export const getIngredientState = (state: RootState) => state.ingredients;

export default ingredientsSlice.reducer;

export const { reducer: ingredientReducer } = ingredientsSlice;
