import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils-types';
import { orderBurgerApi } from '@api';
import type { RootState } from '../../services/store';

interface ConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const getOrderBurger = createAsyncThunk(
  'constructor/getOrderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

const moveIngredient = (
  ingredients: TConstructorIngredient[],
  from: number,
  to: number
): TConstructorIngredient[] => {
  const result = [...ingredients];
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved);
  return result;
};

export const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (item: TIngredient) => ({
        payload: { ...item, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: TConstructorIngredient) => item.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item: TConstructorIngredient) => item.id === action.payload
      );
      if (index > 0) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item: TConstructorIngredient) => item.id === action.payload
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index + 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index + 1]
        ];
      }
    }
    /*resetConstructor: (state) => {
        state.constructorItems = { bun: null, ingredients: [] };
      },
      setRequest: (state, action: PayloadAction<boolean>) => {
        state.orderRequest = action.payload;
      },
      resetModal: (state) => {
        state.orderModalData = null;
      }*/
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderBurger.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(getOrderBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = null;
        state.orderModalData = action.payload.order;
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(getOrderBurger.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.error.message || null;
      });
  }
});

const selectConstructor = (state: RootState) => state.burgers;

export const getConstructorState = createSelector(
  [selectConstructor],
  (state) => state.constructorItems
);

export const getOrderRequest = (state: RootState) =>
  selectConstructor(state).orderRequest;

export const getOrderModalData = (state: RootState) =>
  selectConstructor(state).orderModalData;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
  //resetConstructor,
  //setRequest,
  //resetModal
} = burgerConstructorSlice.actions;

export const constructorReducer = burgerConstructorSlice.reducer;
