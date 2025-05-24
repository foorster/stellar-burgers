import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getIngredientState } from '../../services/ingredients/slice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday
} from '../../services/feed/slice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);
  const total = useSelector(getFeedTotal);
  const totalToday = useSelector(getFeedTotalToday);

  console.log(`FeedInfo: Выполнено заказов за сегодня: ${totalToday}`); // Лог для проверки totalToday

  const { id } = useParams();
  const ingredientsState = useSelector(getIngredientState);
  const ingredientData = ingredientsState.ingredients.find((i) => i._id === id);

  const readyOrders = getOrders(orders, 'done'); // Готовы

  const pendingOrders = getOrders(orders, 'pending'); // Готовятся

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total: total, totalToday: totalToday }}
    />
  );
};
