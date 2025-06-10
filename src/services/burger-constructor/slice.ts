// Cлайс управляет состоянием конструктора бургера,
// включая выбранные ингредиенты (булку и начинку),
// информацию о запросах на создание заказа и данные модального окна заказа

import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';
import type { RootState } from '../../services/store';

interface ConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean; // Флаг, показывающий, выполняется ли запрос на создание заказа
  orderModalData: any | null; // Данные для модального окна с информацией о заказе
  loading: boolean; // Флаг, показывающий, загружаются ли данные
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

// Асинхронный thunk для создания заказа
export const getOrderBurger = createAsyncThunk(
  'constructor/getOrderBurger',
  orderBurgerApi
);

// Функция для перемещения ингредиента в массиве
const moveIngredient = (
  ingredients: TConstructorIngredient[],
  from: number,
  to: number
): TConstructorIngredient[] => {
  const result = [...ingredients]; // Создаем копию массива
  const [moved] = result.splice(from, 1); // Удаляем элемент из позиции from
  result.splice(to, 0, moved); // Вставляем элемент в позицию to
  return result; // Возвращаем новый массив
};

export const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          // Если это булка (будем только заменять)
          state.constructorItems.bun = action.payload;
        } else {
          // Если это ингредиент
          state.constructorItems.ingredients.push(action.payload); // Добавляем в список
        }
      },
      // Добавление уникального ID ингредиенту
      prepare: (item: TIngredient) => ({
        payload: { ...item, id: nanoid() } // Добавляем ID к ингредиенту
      })
    },
    // Удаление ингредиента из конструктора
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: TConstructorIngredient) => item.id !== action.payload // action.payload - ID ингредиента
        );
    },
    // Перемещение ингредиента вверх
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        // Находим индекс ингредиента
        (item: TConstructorIngredient) => item.id === action.payload
      );
      if (index > 0) {
        // Если ингредиент не первый
        state.constructorItems.ingredients = moveIngredient(
          // Используем функцию moveIngredient для перемещения
          state.constructorItems.ingredients,
          index,
          index - 1
        );
      }
    },
    // Перемещение ингредиента вниз
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        // Находим индекс ингредиента
        (item: TConstructorIngredient) => item.id === action.payload
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        // Если ингредиент не последний
        state.constructorItems.ingredients = moveIngredient(
          // Используем функцию moveIngredient для перемещения
          state.constructorItems.ingredients,
          index,
          index + 1
        );
      }
    },
    // Сброс корзины конструктора
    resetConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] }; // Обнуляем ингредиенты
    },
    // Устанавливаем флаг orderRequest
    setRequest: (state, action: PayloadAction<boolean>) => {
      // Индикатор того, что в данный момент выполняется запрос на создание заказа, чтоб повторно не создать запрос
      state.orderRequest = action.payload;
    },
    resetModal: (state) => {
      state.orderModalData = null; // Чистим модалку
    },
    closeOrderModal: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderBurger.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(getOrderBurger.fulfilled, (state, action) => {
        // action.payload - данные, полученные из апи
        state.loading = false;
        state.orderRequest = false;
        state.error = null;
        state.orderModalData = action.payload.order; // Устанавливаем данные для модального окна
        state.constructorItems = { bun: null, ingredients: [] }; // Обнуляем ингредиенты
      })
      .addCase(getOrderBurger.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.error.message || null;
      });
  }
});

// Селектор для получения состояния конструктора
const selectConstructor = (state: RootState) => state.burgers; // Берем состояние о бургере из стора

// Селектор для получения ингредиентов конструктора
export const getConstructorState = createSelector(
  [selectConstructor],
  (state) => state.constructorItems // Возвращаем ингредиенты из состояния selectConstructor
);

// Селектор для получения состояния orderRequest
export const getOrderRequest = (state: RootState) =>
  selectConstructor(state).orderRequest;

// Селектор для получения данных модального окна
export const getOrderModalData = (state: RootState) =>
  selectConstructor(state).orderModalData;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
  setRequest,
  resetModal,
  closeOrderModal
} = burgerConstructorSlice.actions;

export const constructorReducer = burgerConstructorSlice.reducer;
export const closeOrderModalReducer = burgerConstructorSlice.reducer;
