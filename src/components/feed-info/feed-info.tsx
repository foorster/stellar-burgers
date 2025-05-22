import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getIngredientState } from '../../services/ingredients/slice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = [];
  const feed = {};
  const { id } = useParams();
  const ingredientsState = useSelector(getIngredientState); // Получаем IngredientsState
  const ingredientData = ingredientsState.ingredients.find((i) => i._id === id);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
