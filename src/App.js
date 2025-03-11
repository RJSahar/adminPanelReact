import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";


function DataFetchingComponent() {
  const [data, setData] = useState([]); // Состояние для хранения данных
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  useEffect(() => {
    // Функция для получения данных
    const fetchData = async () => {
      try {
        const response = await fetch('https://www.centrmag.ru/testReact.php'); // Замените на ваш URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result); // Сохраняем полученные данные в состоянии
      } catch (err) {
        setError(err.message); // Сохраняем ошибку в состоянии
      } finally {
        setLoading(false); // Устанавливаем загрузку в false
      }
    };

    fetchData(); // Вызываем функцию получения данных
  }, []); // Пустой массив зависимостей означает выполнение только при первом рендере

  if (loading) return <p>Загрузка...</p>; // Отображаем сообщение загрузки
  if (error) return <p>Произошла ошибка: {error}</p>; // Отображаем сообщение об ошибке

  return (
    <div>
      <h1>Полученные данные:</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <strong>{item.name}:</strong> {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataFetchingComponent;