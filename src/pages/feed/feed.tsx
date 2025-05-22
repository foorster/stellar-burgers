import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday
} from '../../services/feed/slice';
export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);
  const total = useSelector(getFeedTotal);
  const totalToday = useSelector(getFeedTotalToday);
  const feed = { total, totalToday };

  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
