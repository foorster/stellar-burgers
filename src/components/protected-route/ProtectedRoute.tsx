import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUserState } from '../../services/user/slice';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps): React.ReactNode => {
  const { isAuthChecked } = useSelector(selectUserState);
  const location = useLocation();

  if (!isAuthChecked && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (isAuthChecked && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
