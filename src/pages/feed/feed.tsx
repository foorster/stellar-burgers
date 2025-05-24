import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeeds
} from '../../services/feed/slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getFeedOrders);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (!orders.length) {
    console.log('Feed: Данные о заказах отсутствуют, отображается Preloader.');
    return <Preloader />;
  }

  console.log('Feed: Данные о заказах получены, передаются в FeedUI:', orders); // Добавили лог

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
