import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiURL } from './constants';
import { RootState } from './app/store';
import { Store } from '@reduxjs/toolkit';
import { UserResponse } from './types';
import { setToken } from './features/users/usersSlice';

const axiosApi = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export const addInterceptors = (store: Store<RootState>) => {
  axiosApi.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = store.getState().users.accessToken;
    const headers = config.headers as AxiosHeaders;
    headers.set('Authorization', `Bearer ${token}`);

    return config;
  });
};

export const checkAccess = (store: Store<RootState>) => {
  axiosApi.interceptors.response.use(
    (config: AxiosResponse) => {
      return config;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        try {
          const response = await axiosApi.get<UserResponse>('/users/refresh');
          const token = response.data.accessToken;
          store.dispatch(setToken(token));
          const headers = originalRequest.headers as AxiosHeaders;
          headers.set('Authorization', `Bearer ${token}`);
          return axiosApi.request(originalRequest);
        } catch (e) {
          console.log('Не авторизован!');
        }
      }
      throw error;
    },
  );
};

export default axiosApi;
