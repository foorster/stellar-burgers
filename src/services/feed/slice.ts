import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';
import { RootState } from '../store';

// Определение типа для состояния ленты заказов
export type TFeedState = {
  orders: TOrder[]; // Массив заказов
  total: number; // Общее количество заказов
  totalToday: number; // Количество заказов за сегодня
  loading: boolean;
  error: string | null;
};

// Начальное состояние ленты заказов
export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};
// Асинхронный thunk для получения данных о заказах
// Использует функцию getFeedsApi для выполнения запроса
export const getFeeds = createAsyncThunk(
  'feed/getFeed', // Уникальный идентификатор thunk
  async () => {
    try {
      console.log('getFeeds: Запрос данных о заказах...');
      const response = await getFeedsApi();
      console.log('getFeeds: Данные о заказах успешно получены:', response);
      return response; // Возвращаем результат запроса
    } catch (error) {
      console.error('getFeeds: Ошибка при получении данных о заказах:', error);
      throw error; // Пробрасываем ошибку, чтобы она была обработана в extraReducers
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        console.log('feedSlice: Начало загрузки данных о заказах (pending).');
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        console.log(
          'feedSlice: Ошибка при загрузке данных о заказах (rejected):',
          action.error.message
        );
        state.loading = false;
        state.error = action.error.message || 'Failed to load orders.';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        console.log(
          'feedSlice: Данные о заказах успешно загружены (fulfilled).'
        );
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders; // Обновляем список заказов
        state.total = action.payload.total; // Обновляем общее количество заказов
        state.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
      });
  }
});

// Экспортируем редюсер
export const feedReducer = feedSlice.reducer;

// Селекторы для доступа к данным из состояния
// Позволяют получить определенные части состояния ленты заказов
export const getFeedOrders = (state: RootState) => {
  console.log('getFeedOrders: Получение списка заказов из состояния.');
  return state.feed.orders;
};

export const getFeedTotal = (state: RootState) => {
  console.log(
    'getFeedTotal: Получение общего количества заказов из состояния.'
  );
  return state.feed.total;
};

export const getFeedTotalToday = (state: RootState) => {
  console.log(
    'getFeedTotalToday: Получение количества заказов за сегодня из состояния.'
  );
  return state.feed.totalToday;
};
