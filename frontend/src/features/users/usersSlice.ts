import { GlobalError, User, UserMutation, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { createUser, facebookLogin, googleLogin, login, updateUser } from './usersThunk';
import { RootState } from '../../app/store';

interface UsersState {
  user: User | null;
  userToEdit: UserMutation | null;
  accessToken: string;
  loginError: GlobalError | null;
  registerError: ValidationError | null;
  loginLoading: boolean;
  registerLoading: boolean;
  editingError: ValidationError | null;
  editOneLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  userToEdit: null,
  accessToken: '',
  loginError: null,
  registerError: null,
  loginLoading: false,
  registerLoading: false,
  editingError: null,
  editOneLoading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.userToEdit = null;
      state.user = null;
      state.accessToken = '';
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, { payload: userResponse }) => {
      state.user = userResponse;
      state.userToEdit = userResponse;
    },
    setThunkError: (state, action) => {
      state.loginError = action.payload;
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
      state.userToEdit = {
        avatar: null,
        displayName: userResponse.user.displayName,
        password: '',
        email: userResponse.user.email,
      };
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
      state.userToEdit = {
        avatar: null,
        displayName: userResponse.user.displayName,
        password: '',
        email: userResponse.user.email,
      };
      state.accessToken = userResponse.accessToken;
    });
    builder.addCase(googleLogin.rejected, (state, { payload: error }) => {
      state.loginError = error || null;
      state.loginLoading = false;
    });
    builder.addCase(facebookLogin.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(facebookLogin.fulfilled, (state, { payload: userResponse }) => {
      state.loginLoading = false;
      state.user = userResponse.user;
      state.userToEdit = {
        avatar: null,
        displayName: userResponse.user.displayName,
        password: '',
        email: userResponse.user.email,
      };
      state.accessToken = userResponse.accessToken;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.editingError = null;
      state.editOneLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload: user }) => {
      state.editOneLoading = false;
      state.user = user;
      state.userToEdit = {
        avatar: null,
        displayName: user.displayName,
        password: '',
        email: user.email,
      };
    });
    builder.addCase(updateUser.rejected, (state, { payload: error }) => {
      state.editingError = error || null;
      state.editOneLoading = false;
    });
    builder.addCase(facebookLogin.rejected, (state, { payload: error }) => {
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
      state.userToEdit = {
        avatar: null,
        displayName: userResponse.user.displayName,
        password: '',
        email: userResponse.user.email,
      };
      state.accessToken = userResponse.accessToken;
    });
    builder.addCase(createUser.rejected, (state, { payload: error }) => {
      state.registerError = error || null;
      state.registerLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, setToken, setUser, setThunkError } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectUserToEdit = (state: RootState) => state.users.userToEdit;
export const selectEditOneUserLoading = (state: RootState) => state.users.editOneLoading;
export const selectEditingError = (state: RootState) => state.users.editingError;
