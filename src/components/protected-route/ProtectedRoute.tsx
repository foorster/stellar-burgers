import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUserState
} from '../../services/user/slice';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

const ProtectedRoute = ({
  onlyUnAuth,
  children
}: TProtectedRouteProps): React.ReactNode => {
  const userState = useSelector(selectUserState);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!userState.user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (userState.user && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
