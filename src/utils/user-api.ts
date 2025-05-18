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
import { deleteCookie, setCookie } from './cookie';
export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser; // Добавьте поле user с типом TUser
  [key: string]: any; // Чтобы не было проблем с другими полями
};

const handleAuthResponse = (data: TAuthResponse) => {
  // Используйте TAuthResponse
  if (!data.success) throw new Error('Authentication failed');

  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data; // **Возвращаем весь объект data, который должен содержать user**
};

export const registerUser = (registerData: TRegisterData) =>
  registerUserApi(registerData).then(handleAuthResponse);

export const loginUser = ({ email, password }: TLoginData) =>
  loginUserApi({ email, password }).then(handleAuthResponse);

export const fetchUser = () => getUserApi();

export const fetchUserOrders = () => getOrdersApi();

export const updateUserData = (userData: TRegisterData) =>
  updateUserApi(userData);

export const logoutUser = async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};
