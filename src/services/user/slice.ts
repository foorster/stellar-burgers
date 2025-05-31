import type { RootState } from '../../services/store';
import * as userApi from '../../utils/user-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie } from '../../utils/cookie';
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

const initialState: TUserState = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  user: null,
  userOrders: [],
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false
};

const createUserThunk = <T>(type: string, apiCall: (data: T) => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (data: T, { rejectWithValue }) => {
    try {
      return await apiCall(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  });

export const getRegisterUser = createUserThunk(
  'register',
  userApi.registerUser
);
export const getLoginUser = createUserThunk('login', userApi.loginUser);
export const updateUser = createUserThunk('update', userApi.updateUserData);

export const createSimpleThunk = (type: string, apiCall: () => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (_, { rejectWithValue }) => {
    try {
      return await apiCall();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  });

export const getUser = createSimpleThunk('getUser', userApi.fetchUser);
export const getOrders = createSimpleThunk(
  'getOrders',
  userApi.fetchUserOrders
);
export const getLogoutUser = createSimpleThunk('logout', userApi.logoutUser);
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.fetchUser();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
const handlePending = (state: TUserState) => {
  state.request = true;
  state.error = null;
};

const handleRejected = (state: TUserState, action: any) => {
  state.request = false;
  state.error = action.payload as string;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    userLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRegisterUser.pending, handlePending)
      .addCase(getRegisterUser.rejected, (state, action) => {
        handleRejected(state, action);
        state.isAuthChecked = true;
      })
      .addCase(getRegisterUser.fulfilled, (state, { payload }) => {
        state.request = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getLoginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(getLoginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.payload as string;
      })
      .addCase(getLoginUser.fulfilled, (state, { payload }) => {
        state.loginUserRequest = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.isAuthChecked = true;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, { payload }) => {
        state.isAuthChecked = true;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.rejected, handleRejected)
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.request = false;
        state.user = payload.user;
      })
      .addCase(getLogoutUser.pending, handlePending)
      .addCase(getLogoutUser.rejected, handleRejected)
      .addCase(getLogoutUser.fulfilled, (state) => {
        state.request = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(getOrders.pending, handlePending)
      .addCase(getOrders.rejected, handleRejected)
      .addCase(getOrders.fulfilled, (state, { payload }) => {
        state.request = false;
        state.userOrders = payload;
      });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserOrders = (state: RootState) => state.user.userOrders;
export const selectRequest = (state: RootState) => state.user.request;
export const selectLoginUserRequest = (state: RootState) =>
  state.user.loginUserRequest;
export const selectError = (state: RootState) => state.user.error;
export const { userLogout, resetError, setAuthChecked } = userSlice.actions;
export const selectUserState = (state: RootState) => state.user;
export default userSlice.reducer;
