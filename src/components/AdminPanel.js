import React from 'react';
import LogoutButton from './LogoutButton';

const AdminPanel = () => {
  return (
    <div>
      <h1>Админ панель</h1>
      <p>Добро пожаловать в панель управления!</p>

      {/* Кнопка выхода */}
      <LogoutButton />
    </div>
  );
};

export default AdminPanel;