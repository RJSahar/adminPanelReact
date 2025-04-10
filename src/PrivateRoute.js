import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  const location = useLocation();

  if (!authToken) {
    // Если токена нет, перенаправляем на страницу входа
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если токен есть, отображаем защищенный маршрут
  return children;
};

export default PrivateRoute;