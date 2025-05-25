import { FC, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { getFeeds, getFeedState } from '../../services/feed/slice';

export const Feed: FC = () => {
  const { orders, isLoading } = useSelector(getFeedState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleRefreshFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefreshFeeds} />;
};
