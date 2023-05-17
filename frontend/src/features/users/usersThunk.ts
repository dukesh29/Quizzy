import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GlobalError,
  LoginMutation,
  UserMutation,
  UserResponse,
  ValidationError,
} from '../../types';
import axiosApi from '../../axios';
import { isAxiosError } from 'axios';
import { RootState } from '../../app/store';
import { unsetUser } from './usersSlice';

export const createUser = createAsyncThunk<
  UserResponse,
  UserMutation,
  { rejectValue: ValidationError }
>('users/create', async (registerMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<UserResponse>('/users/registration', registerMutation);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const login = createAsyncThunk<UserResponse, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<UserResponse>('/users/login', loginMutation);
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400)
        return rejectWithValue(e.response.data as GlobalError);

      throw e;
    }
  },
);

export const googleLogin = createAsyncThunk<UserResponse, string, { rejectValue: GlobalError }>(
  'users/googleLogin',
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<UserResponse>('/users/google', { accessToken });
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400)
        return rejectWithValue(e.response.data as GlobalError);

      throw e;
    }
  },
);

export const logout = createAsyncThunk<void, void, { state: RootState }>(
  'users/logout',
  async (_, { dispatch }) => {
    dispatch(unsetUser());
    await axiosApi.post('/users/logout');
  },
);
