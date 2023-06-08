import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { UserMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectEditingError, selectEditOneUserLoading, selectUserToEdit } from '../usersSlice';
import FileInput from '../../../components/FileInput/FileInput';
import { updateUser } from '../usersThunk';
import { enqueueSnackbar } from 'notistack';

interface Props {
  id: string;
  setModal: () => void;
}

const UserFormToEdit: React.FC<Props> = ({ id, setModal }) => {
  const dispatch = useAppDispatch();
  const userToEdit = useAppSelector(selectUserToEdit);
  const [state, setState] = useState<UserMutation>({
    email: userToEdit?.email || '',
    displayName: userToEdit?.displayName || '',
    password: '',
    avatar: null,
  });
  const error = useAppSelector(selectEditingError);
  const loading = useAppSelector(selectEditOneUserLoading);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(updateUser({ id: id, userToUpdate: state })).unwrap();
      enqueueSnackbar('Вы успешно отредактировали! ', {
        variant: 'success',
        autoHideDuration: 2000,
      });
    } catch (e) {
      enqueueSnackbar('Что то пошло не так! ', {
        variant: 'error',
        autoHideDuration: 2000,
      });
    }
    setModal();
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        Обновить профиль
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
          {error.message}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={submitFormHandler}
        sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}
      >
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              color="secondary"
              label="Email пользователя"
              type="email"
              name="email"
              autoComplete="off"
              value={state.email}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              color="secondary"
              label="Имя пользователя"
              name="displayName"
              autoComplete="off"
              value={state.displayName}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              color="secondary"
              label="Пароль пользователя"
              name="password"
              type="password"
              autoComplete="off"
              value={state.password}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <FileInput onChange={fileInputChangeHandler} name="avatar" label="Обновить аватар" />
          </Grid>
        </Grid>
        <Button
          sx={{ color: '#776BCC', border: '1px solid #776BCC', alignSelf: 'center', my: 2 }}
          type="submit"
          variant="outlined"
        >
          {loading ? <CircularProgress color="secondary" size="small" /> : 'Обновить'}
        </Button>
      </Box>
    </Box>
  );
};
export default UserFormToEdit;
