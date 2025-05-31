// Импортируем апи и типы из бургер апи
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  type TLoginData,
  type TRegisterData,
  updateUserApi
} from '@api';

// Импортируем утилиты для работы с куками и локальным хранилищем
import { deleteCookie, setCookie } from './cookie';

//Обрабатывает ответ от сервера при авторизации/регистрации
const handleAuthResponse = (data: {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}) => {
  // Проверяем успешность запроса
  if (!data.success) throw new Error('Authentication failed');

  // Сохраняем токен в куки
  setCookie('accessToken', data.accessToken);

  // Сохраняем токен, он живёт дольше и нужен для восстановления сессии
  localStorage.setItem('refreshToken', data.refreshToken);

  return data; // Вернули статус и данные
};

// Регистрируем нового пользователя, возвращаем промис с результатом аутентификации
export const registerUser = (registerData: TRegisterData) =>
  registerUserApi(registerData).then(handleAuthResponse);

// Авторизуем пользователя по email и паролю и возввращаем промис с результатом аутентификации
export const loginUser = ({ email, password }: TLoginData) =>
  loginUserApi({ email, password }).then(handleAuthResponse);

// Получаем данные текущего пользователя и возвращаем промис с данными пользователя
export const fetchUser = () => getUserApi();

// Получаем список заказов текущего пользователя и возвращаем промис с массивом заказов
export const fetchUserOrders = () => getOrdersApi();

// Обновляем данные текущего пользователя и возвращаем промис с обновлёнными данными

export const updateUserData = (userData: TRegisterData) =>
  updateUserApi(userData);

/*
Выполняет выход пользователя:
1. Отправляем запрос на бэкенд для инвалидации токена
2. Удаляем refreshToken из localStorage
3. Удаляем accessToken из cookies
 */
export const logoutUser = async () => {
  await logoutApi(); // отправляем запрос на сервер, чтобы инвалидировать токен

  localStorage.removeItem('refreshToken'); // удаляем токен из localStorage
  deleteCookie('accessToken'); // удаляем access-токен из куки
};
