import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginForm.module.css'; // Импортируем стили

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://mpanalyticsback.mk-developers.ru/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токен в localStorage
        localStorage.setItem('authToken', data.token);
        // Выводим localStorage в консоль для проверки
        console.log('Токен сохранен:', localStorage);

        // Перенаправляем на предыдущий маршрут или на /admin
        const from = location.state?.from || '/admin';
        console.log(from);
        navigate(from, { replace: true });
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch (error) {
      setError('Сетевая ошибка');
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2>Вход в систему</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginForm;