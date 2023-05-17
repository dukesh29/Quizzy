import { GlobalError, User, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { createUser, googleLogin, login } from './usersThunk';
import { RootState } from '../../app/store';

interface UsersState {
  user: User | null;
  accessToken: string;
  loginError: GlobalError | null;
  registerError: ValidationError | null;
  loginLoading: boolean;
  registerLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  accessToken: '',
  loginError: null,
  registerError: null,
  loginLoading: false,
  registerLoading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
      state.accessToken = '';
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload: userResponse }) => {
      state.loginLoading = false;
      state.user = userResponse.user;
      state.accessToken = userResponse.accessToken;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginError = error || null;
      state.loginLoading = false;
    });
    builder.addCase(googleLogin.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(googleLogin.fulfilled, (state, { payload: userResponse }) => {
      state.loginLoading = false;
      state.user = userResponse.user;
      state.accessToken = userResponse.accessToken;
    });
    builder.addCase(googleLogin.rejected, (state, { payload: error }) => {
      state.loginError = error || null;
      state.loginLoading = false;
    });

    builder.addCase(createUser.pending, (state) => {
      state.registerError = null;
      state.registerLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state, { payload: userResponse }) => {
      state.registerLoading = false;
      state.user = userResponse.user;
      state.accessToken = userResponse.accessToken;
    });
    builder.addCase(createUser.rejected, (state, { payload: error }) => {
      state.registerError = error || null;
      state.registerLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;

export const { unsetUser, setToken } = usersSlice.actions;
