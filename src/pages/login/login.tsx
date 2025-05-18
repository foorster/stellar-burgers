import { FC, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LoginUI } from '@ui-pages';
import { getLoginUser, selectUserState } from '../../services/user/slice'; // Импортируем thunk для логина и селектор состояния пользователя
import type { AppDispatch } from '../../services/store'; // Импортируем тип AppDispatch для типизации dispatch

// Определяем интерфейс для данных формы логина
interface LoginForm {
  email: string;
  password: string;
}

// Login компонент
export const Login: FC = () => {
  // Используем useState для хранения данных формы
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });

  // Используем useSelector для получения error и isAuthenticated из состояния пользователя
  const { error, isAuthenticated } = useSelector(selectUserState);

  // Используем useDispatch для получения функции dispatch и типизируем ее с помощью AppDispatch
  const dispatch = useDispatch<AppDispatch>();

  // Функция для обработки изменений в полях формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Обновляем состояние formData с новым значением поля
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Функция для обработки отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Проверяем, что email и password не пустые
    if (formData.email && formData.password) {
      // Отправляем асинхронный thunk getLoginUser с данными формы
      dispatch(getLoginUser(formData));
    }
  };

  // Если пользователь аутентифицирован, перенаправляем на главную страницу
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // Если пользователь не аутентифицирован, отображаем форму логина
  return (
    <LoginUI
      errorText={error ?? ''} // Отображаем сообщение об ошибке, если есть
      email={formData.email} // Передаем email в LoginUI
      setEmail={(
        value // Передаем функцию для обновления email
      ) =>
        handleChange({
          target: { name: 'email', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      password={formData.password} // Передаем password в LoginUI
      setPassword={(
        value // Передаем функцию для обновления password
      ) =>
        handleChange({
          target: { name: 'password', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit} // Передаем функцию для отправки формы
    />
  );
};
