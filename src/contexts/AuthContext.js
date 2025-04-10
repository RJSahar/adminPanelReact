import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);

  // Функция для входа
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token); // Обновляем состояние
  };

  // Функция для выхода
  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null); // Очищаем состояние
  };

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken); // Устанавливаем токен из localStorage
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};