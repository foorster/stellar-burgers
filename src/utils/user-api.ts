import {
  getOrdersApi,
  registerUserApi,
  type TLoginData,
  type TRegisterData,
  updateUserApi,
  getUserApi,
  loginUserApi,
  logoutApi
} from '../utils/burger-api';
import { deleteCookie, setCookie } from './cookie';

export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: TUser;
  [key: string]: any;
};

const handleAuthResponse = (data: TAuthResponse) => {
  console.log('handleAuthResponse data:', data);

  if (!data.success) {
    console.error('Authentication failed:', data);
    throw new Error('Authentication failed');
  }

  if (data.accessToken) {
    setCookie('accessToken', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  return data;
};

export const registerUser = (registerData: TRegisterData) => {
  console.log('registerUser data:', registerData);

  return registerUserApi(registerData)
    .then((response) => {
      console.log('registerUser response:', response);
      return handleAuthResponse(response);
    })
    .catch((error) => {
      console.error('registerUser error:', error);
      throw error;
    });
};

export const loginUser = ({ email, password }: TLoginData) => {
  console.log('loginUser data:', { email, password });

  return loginUserApi({ email, password })
    .then((response) => {
      console.log('loginUser response:', response);
      return handleAuthResponse(response);
    })
    .catch((error) => {
      console.error('loginUser error:', error);
      throw error;
    });
};

export const fetchUser = async () => {
  console.log('fetchUser called');

  try {
    const response = await getUserApi();
    console.log('fetchUser response:', response);
    return response;
  } catch (error) {
    console.error('fetchUser error:', error);
    throw error;
  }
};

export const fetchUserOrders = async () => {
  console.log('fetchUserOrders called');

  try {
    const response = await getOrdersApi();
    console.log('fetchUserOrders response:', response);
    return response;
  } catch (error) {
    console.error('fetchUserOrders error:', error);
    throw error;
  }
};

export const updateUserData = (userData: TRegisterData) => {
  console.log('updateUserData data:', userData);

  return updateUserApi(userData)
    .then((response) => {
      console.log('updateUserData response:', response);
      return handleAuthResponse(response);
    })
    .catch((error) => {
      console.error('updateUserData error:', error);
      throw error;
    });
};

export const logoutUser = async () => {
  console.log('logoutUser called');

  try {
    await logoutApi();
    console.log('logoutApi successful');
  } catch (error) {
    console.error('logoutApi error:', error);
    throw error;
  } finally {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
};
