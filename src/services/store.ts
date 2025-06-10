import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers } from 'redux';
import userReducer from './user/slice';
import ingredientReducer from './ingredients/slice';
import { constructorReducer } from './burger-constructor/slice';
import { feedReducer } from './feed/slice';
import { orderReducer } from './order/slice';

export const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientReducer,
  burgers: constructorReducer,
  feed: feedReducer,
  order: orderReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
