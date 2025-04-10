import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton'; // Импортируем кнопку выхода

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);

  // Состояние для хранения данных о товарах
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState([]); // Массив данных о товаре
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Состояние для поля ввода ID товара
  const [productId, setProductId] = useState(''); // <-- Добавляем состояние

  // Парсим токен для получения данных пользователя (например, username)
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Декодируем payload JWT
    } catch (e) {
      return null;
    }
  };

  const tokenData = parseJwt(authToken); // Получаем данные из токена
  const username = tokenData?.username || 'Гость'; // Имя пользователя или "Гость"

  // Функция для получения данных о товарах
  const fetchPriceNoValid = async () => {
    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const response = await fetch('http://mpanalyticsback.mk-developers.ru/wb/priceNoValid', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Сохраняем данные о товарах
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при получении данных');
      }
    } catch (err) {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения данных о конкретном товаре
  const fetchProductDetails = async () => {
    setLoading(true);
    setError('');
    setProductDetails([]);

    try {
      const response = await fetch(`http://mpanalyticsback.mk-developers.ru/wb/nomenklature/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setProductDetails(data); // Сохраняем массив данных
        } else {
          setError('Некорректные данные от сервера');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при получении данных о товаре');
      }
    } catch (err) {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Боковое меню */}
      <aside style={styles.sidebar}>
        <h3>Меню</h3>
        <ul>
          <li>Главная</li>
          <li>Настройки</li>
          <li>Профиль</li>
        </ul>
        
        {/* Кнопка проверки цен */}
        <button
          onClick={fetchPriceNoValid}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Проверить цены
        </button>
        
        {/* Поле для ввода ID товара */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Введите ID товара"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{
              padding: '8px',
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={fetchProductDetails}
            style={{
              padding: '8px 15px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Получить данные о товаре
          </button>
        </div>


        {/* Кнопка выхода */}
        <div style={{ marginTop: 'auto', padding: '10px' }}>
          <LogoutButton />
        </div>
      </aside>

      {/* Основное содержимое */}
      <main style={styles.mainContent}>
        <h1>Привет, {username}!</h1>
        <p>Добро пожаловать в админ-панель.</p>

        {/* Отображение данных о товарах */}
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {products.length > 0 && (
          <div>
            <h2>Товары с некорректными ценами:</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableTh}>ID товара</th>
                  <th style={styles.tableTh}>Кабинет</th>
                  <th style={styles.tableTh}>nmID</th>
                  <th style={styles.tableTh}>Артикул товара</th>
                  <th style={styles.tableTh}>Штрихкод товара</th>
                  <th style={styles.tableTh}>Цена на WB</th>
                  <th style={styles.tableTh}>Цена со скидкой на WB</th>
                  <th style={styles.tableTh}>Скидка на WB</th>
                  <th style={styles.tableTh}>Остаток товара на WB</th>
                  <th style={styles.tableTh}>Цена на сайте</th>
                  <th style={styles.tableTh}>Остаток товара на сайте</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={styles.tableTd}>{product.Id}</td>
                    <td style={styles.tableTd}>{product.Cabinet}</td>
                    <td style={styles.tableTd}>{product.nmId}</td>
                    <td style={styles.tableTd}>{product.vendorCode}</td>
                    <td style={styles.tableTd}>{product.barcodeWB}</td>
                    <td style={styles.tableTd}>{product.priceWB}</td>
                    <td style={styles.tableTd}>{product.discountedPriceWB}</td>
                    <td style={styles.tableTd}>{product.discount}</td>
                    <td style={styles.tableTd}>{product.stockWB}</td>
                    <td style={styles.tableTd}>{product.priceSite}</td>
                    <td style={styles.tableTd}>{product.stockSite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Отображение данных о конкретном товаре */}
        {productDetails.length > 0 && (
          <div>
            <h2>Информация о товаре:</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableTh}>Кабинет</th>
                  <th style={styles.tableTh}>Цена WB</th>
                  <th style={styles.tableTh}>Скидочная цена WB</th>
                  <th style={styles.tableTh}>Скидка (%)</th>
                  <th style={styles.tableTh}>Остаток на WB</th>
                  <th style={styles.tableTh}>Цена на сайте</th>
                  <th style={styles.tableTh}>Остаток на сайте</th>
                </tr>
              </thead>
              <tbody>
                {productDetails.map((item) => (
                  <tr key={item.Id}>
                    <td style={styles.tableTd}>{item.Cabinet}</td>
                    <td style={styles.tableTd}>{item.priceWB}</td>
                    <td style={styles.tableTd}>{item.discountedPriceWB}</td>
                    <td style={styles.tableTd}>{item.discount}%</td>
                    <td style={styles.tableTd}>{item.stockWB}</td>
                    <td style={styles.tableTd}>{item.priceSite}</td>
                    <td style={styles.tableTd}>{item.stockSite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {productDetails.length === 0 && productId && !loading && !error && (
          <p>Товар с ID "{productId}" не найден.</p>
        )}
      </main>
    </div>
  );
};

// Стили
const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#ffffff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableTh: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
  },
  tableTd: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  },
};

export default Dashboard;