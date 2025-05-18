import type { TRegisterData } from '@api';
import { TOrder, TUser } from '@utils-types';

export type Nullable<T> = T | null;
export type StateError = Nullable<string>;
type TUserStateResponse = Nullable<TUser>;
type TUserStateRegisterData = Nullable<TRegisterData>;
type TUserStateAtr = Nullable<TUser>;

export type TUserState = {
  request: boolean;
  error: StateError;
  response: TUserStateResponse;
  registerData: TUserStateRegisterData;
  user: TUserStateAtr;
  userOrders: TOrder[];
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
};
