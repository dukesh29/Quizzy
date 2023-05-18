import React, { useState } from 'react';
import { LoginMutation } from '../../types';
import LoginIcon from '@mui/icons-material/Login';
import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from './usersThunk';
import { selectLoginError, selectLoginLoading } from './usersSlice';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import SocialSiteLogin from './components/SocialSiteLogin';
import './styles/LoginForm.scss';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginError = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginMutation>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const notifySuccess = () =>
    toast.success('Добро пожаловать в Quizzy!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const [isVisible, setIsVisible] = useState(false);

  const onSubmit: SubmitHandler<LoginMutation> = async (data) => {
    await dispatch(login(data)).unwrap();
    notifySuccess();
    reset();
    navigate('/');
  };

  return (
    <div className="container">
      <div className="screen-login">
        <div className="screen-login__content">
          <form onSubmit={handleSubmit(onSubmit)} className="login">
            <div className="login__main">
              <h3 className="login__title"> Логин </h3>
              <LoginIcon fontSize="large" className="login__icon" />
            </div>
            {loginError && <div className="global_error">{loginError.message}</div>}
            <div className="login__field">
              <MailIcon fontSize="small" className="login__icon" />
              <input
                type="email"
                {...register('email', {
                  required: 'Поле обязательно для введения!',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Неправильный email!',
                  },
                })}
                className="login__input"
                placeholder="Email"
              />
              {errors?.email && <div className="error">{errors.email.message}</div>}
            </div>
            <div className="login__field">
              <KeyIcon fontSize="small" className="login__icon" />
              <input
                type={isVisible ? 'text' : 'password'}
                {...register('password', {
                  required: 'Поле обязательно для введения!',
                })}
                className="login__input"
                placeholder="Пароль"
              />
              <span onClick={() => setIsVisible(!isVisible)} className="login__visibilityIcon">
                {isVisible ? (
                  <VisibilitySharpIcon fontSize="small" />
                ) : (
                  <VisibilityOffSharpIcon fontSize="small" />
                )}
              </span>
              {errors?.password && <div className="error">{errors.password.message}</div>}
            </div>
            <button type="submit" disabled={!isValid || loading} className="button login__submit">
              {loading ? <CircularProgress /> : 'Войти'}
            </button>
          </form>
          <div className="social-login">
            <h3>Войти через соцсети или</h3>
            <Link to="/register" className="social-login__register">
              зарегистрироваться
            </Link>
            <div className="social-icons">
              <SocialSiteLogin isLogin />
            </div>
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
