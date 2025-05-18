import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store'; // Убедитесь, что путь правильный
import { selectUserState } from '../../services/user/slice'; // Убедитесь, что путь правильный

// Определите типы для ваших компонентов
type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

// Определите ваш ProtectedRoute компонент
const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps): React.ReactNode => {
  const { user, isAuthChecked } = useSelector(selectUserState);
  const location = useLocation();

  if (!isAuthChecked) {
    return <p>Загрузка....</p>;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: string })?.from || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
