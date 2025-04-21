import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton'; // Импортируем кнопку выхода

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const corsUrl = `http://localhost:3000/`;

  // Единое состояние для хранения данных
  const [data, setData] = useState({
    items: [],
    type: null,
  });

  const [productId, setProductId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await fetch('http://mpanalyticsback.mk-developers.ru/wb/priceNoValid', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Origin': corsUrl
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        setData({ items: fetchedData, type: 'priceNoValid' });
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

    try {
      const response = await fetch(`http://mpanalyticsback.mk-developers.ru/wb/nomenklature/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Origin': corsUrl
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        if (Array.isArray(fetchedData)) {
          setData({ items: fetchedData, type: 'productDetails' });
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

  // Функция для получения товаров, у которых остатки на WB больше, чем на сайте
  const fetchStockWBStockSite = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://mpanalyticsback.mk-developers.ru/wb/stockWB_stockSite', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Origin': corsUrl
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        setData({ items: fetchedData, type: 'stockWB_stockSite' });
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

  // Функция для получения товаров, у которых остатки на сайте больше, чем на WB
  const fetchStockSiteStockWB = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://mpanalyticsback.mk-developers.ru/wb/stockSite_stockWB', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Origin': corsUrl
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        setData({ items: fetchedData, type: 'stockSite_stockWB' });
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

  // Функция для получения товаров, которые не выложены на WB
const fetchReklamaNoWB = async () => {
  setLoading(true);
  setError('');
  try {
    // Логирование токена
    if (!authToken) {
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await fetch('http://mpanalyticsback.mk-developers.ru/wb/reklama_noWB', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Origin': corsUrl
      },
    });

    console.log('Заголовки ответа:', response.headers);
    console.log('Ответ сервера:', response);
    if (response.ok) {
      const fetchedData = await response.json();
      console.log('Полученные данные:', fetchedData);
      setData({ items: fetchedData, type: 'reklama_noWB' }); // Сохраняем данные с типом
    } else {
      const errorData = await response.json();
      console.error('Ошибка сервера:', errorData);
      setError(errorData.error || 'Ошибка при получении данных');
    }
  } catch (err) {
    console.error('Сетевая ошибка:', err);
    setError('Сетевая ошибка');
  } finally {
    setLoading(false);
  }
};

// Функция для получения товаров, которые не выложены на каом-то маркетплейсе
const fetchTovarsOnMarketplace = async () => {
setLoading(true);
setError('');
try {
  // Логирование токена
  if (!authToken) {
    throw new Error('Токен авторизации отсутствует');
  }

  const response = await fetch('http://mpanalyticsback.mk-developers.ru/wb/tovarsOnMarketplace', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Origin': corsUrl
    },
  });

  if (response.ok) {
    const fetchedData = await response.json();
    setData({ items: fetchedData, type: 'tovarsOnMarketplace' }); // Сохраняем данные с типом
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

        {/* Кнопка проверки остатков больше на WB */}
        <button
          onClick={fetchStockWBStockSite}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Проверить остатки больше на WB
        </button>

        {/* Кнопка проверки остатков больше на сайте */}
        <button
          onClick={fetchStockSiteStockWB}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Проверить остатки больше на сайте
        </button>

        {/* Кнопка проверки товаров, не выложенных на WB */}
        <button
          onClick={fetchReklamaNoWB}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Проверить товары, не выложенные на WB
        </button>

        {/* Кнопка проверки товаров, не выложенных на каком-то маркетплейсе */}
        <button
          onClick={fetchTovarsOnMarketplace}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Проверить товары, не выложенные на каком-то маркетплейсе
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
        {data.items.length > 0 && data.type === 'priceNoValid' && (
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
              {data.items.map((product) => (
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
        {data.items.length > 0 && data.type === 'productDetails' && (
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
              {data.items.map((item) => (
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
        {data.items.length === 0 && productId && !loading && !error && (
          <p>Товар с ID "{productId}" не найден.</p>
        )}

        {data.items.length > 0 && data.type === 'stockWB_stockSite' && (
          <div>
            <h2>Товары с остатками на WB больше, чем на сайте:</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableTh}>Кабинет</th>
                  <th style={styles.tableTh}>Артикул</th>
                  <th style={styles.tableTh}>Остаток на WB</th>
                  <th style={styles.tableTh}>Остаток на сайте</th>
                  <th style={styles.tableTh}>Цена WB</th>
                  <th style={styles.tableTh}>Цена на сайте</th>
                </tr>
              </thead>
              <tbody>
              {data.items.map((item) => (
                  <tr key={item.Id}>
                    <td style={styles.tableTd}>{item.Cabinet}</td>
                    <td style={styles.tableTd}>{item.vendorCode}</td>
                    <td style={styles.tableTd}>{item.stockWB}</td>
                    <td style={styles.tableTd}>{item.stockSite}</td>
                    <td style={styles.tableTd}>{item.priceWB}</td>
                    <td style={styles.tableTd}>{item.priceSite}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}

          {data.items.length > 0 && data.type === 'stockSite_stockWB' && (
            <div>
              <h2>Товары с остатками на WB больше, чем на сайте:</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>Кабинет</th>
                    <th style={styles.tableTh}>Артикул</th>
                    <th style={styles.tableTh}>Остаток на WB</th>
                    <th style={styles.tableTh}>Остаток на сайте</th>
                    <th style={styles.tableTh}>Цена WB</th>
                    <th style={styles.tableTh}>Цена на сайте</th>
                  </tr>
                </thead>
                <tbody>
                {data.items.map((item) => (
                    <tr key={item.Id}>
                      <td style={styles.tableTd}>{item.Cabinet}</td>
                      <td style={styles.tableTd}>{item.vendorCode}</td>
                      <td style={styles.tableTd}>{item.stockWB}</td>
                      <td style={styles.tableTd}>{item.stockSite}</td>
                      <td style={styles.tableTd}>{item.priceWB}</td>
                      <td style={styles.tableTd}>{item.priceSite}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}

          {data.items.length > 0 && data.type === 'reklama_noWB' && (
            <div>
              <h2>Товары, не выложенные на WB:</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>ID</th>
                    <th style={styles.tableTh}>Наименование</th>
                    <th style={styles.tableTh}>Остаток</th>
                    <th style={styles.tableTh}>Наличие</th>
                    <th style={styles.tableTh}>Производим</th>
                    <th style={styles.tableTh}>Цена</th>
                    <th style={styles.tableTh}>Тип</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td style={styles.tableTd}>{item.id}</td>
                      <td style={styles.tableTd}>{item.ogl}</td>
                      <td style={styles.tableTd}>{item.ost}</td>
                      <td style={styles.tableTd}>{item.nal ? 'Да' : 'Нет'}</td>
                      <td style={styles.tableTd}>{item.proizvodim ? 'Да' : 'Нет'}</td>
                      <td style={styles.tableTd}>{item.cena}</td>
                      <td style={styles.tableTd}>{item.nomType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.items.length > 0 && data.type === 'tovarsOnMarketplace' && (
            <div>
              <h2>Товары, не выложенные на маркетплейсах:</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>Артикул</th>
                    <th style={styles.tableTh}>Название</th>
                    <th style={styles.tableTh}>Ссылка на товар</th>
                    <th style={styles.tableTh}>YandexMarket</th>
                    <th style={styles.tableTh}>Ozon</th>
                    <th style={styles.tableTh}>WB</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.Id}>
                      <td style={styles.tableTd}>{item.mainId}</td>
                      <td style={styles.tableTd}>{item.ogl}</td>
                      <td style={styles.tableTd}>
                      <a
                        href={`https://www.centrmag.ru/catalog/product/${item.id_dop}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'underline' }}
                      >
                        Перейти к товару
                      </a>
                      </td>
                      <td style={styles.tableTd}>{item.market ? 'Да' : 'Нет'}</td>
                      <td style={styles.tableTd}>{item.ozon ? 'Да' : 'Нет'}</td>
                      <td style={styles.tableTd}>{item.wb ? 'Да' : 'Нет'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.items.length === 0 && !loading && !error && (
            <p>Данные не найдены.</p>
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