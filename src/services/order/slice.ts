import { TOrder } from '@utils-types';
import {
  createSlice,
  createAsyncThunk,
  SerializedError
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getOrdersApi, getOrderByNumberApi } from '@api';

// Описывает, как выглядит состояние для заказов в Redux сторе
export type TOrderState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  error: SerializedError | null;
  loading: boolean;
};

export const initialState: TOrderState = {
  orders: [],
  currentOrder: null,
  error: null,
  loading: false
};

// Получение одного заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

// Получение списка всех заказов
export const getOrder = createAsyncThunk('order/getOrders', async () =>
  getOrdersApi()
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null; // Сброс текущего заказа
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      });

    // Получение одного заказа по номеру
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.currentOrder = null;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        // Сохраняем первый заказ из ответа
        state.currentOrder = action.payload.orders[0] ?? null;
        state.loading = false;
        state.error = null;
      });
  }
});

export const getCurrentOrder = (state: RootState): TOrder | null =>
  state.order.currentOrder;
export const getLoadingSelector = (state: RootState): boolean =>
  state.order.loading;
export const getErrorSelector = (state: RootState): SerializedError | null =>
  state.order.error;
export const getAllOrdersSelector = (state: RootState): TOrder[] =>
  state.order.orders;
export const { clearCurrentOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
