import React, { useState } from 'react';
import { UserMutation } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';
import AccessibilityNewSharpIcon from '@mui/icons-material/AccessibilityNewSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createUser } from './usersThunk';
import { CircularProgress } from '@mui/material';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import SocialSiteLogin from './components/SocialSiteLogin';
import './styles/RegisterForm.scss';
import { enqueueSnackbar } from 'notistack';

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);
  const serverError = useAppSelector(selectRegisterError);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<UserMutation>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const [isVisible, setIsVisible] = useState(false);

  const getFieldError = (fieldName: string) => {
    try {
      return serverError?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const onSubmit: SubmitHandler<UserMutation> = async (data) => {
    try {
      await dispatch(createUser(data)).unwrap();
      enqueueSnackbar('Вы успешно зарегистрировались в Quizzy! ', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      reset();
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Что то пошло не так! ', { variant: 'error', autoHideDuration: 3000 });
      setError('email', {
        type: 'manual',
        message: getFieldError('email'),
      });
      setError('password', {
        type: 'manual',
        message: getFieldError('password'),
      });
      setError('displayName', {
        type: 'manual',
        message: getFieldError('displayName'),
      });
    }
  };

  return (
    <div className="screen-register">
      <div className="screen-register__content">
        <form onSubmit={handleSubmit(onSubmit)} className="register">
          <div className="register__main">
            <h3 className="register__title"> Регистрация </h3>
            <ExitToAppSharpIcon fontSize="large" className="register__icon" />
          </div>
          <div className="register__field">
            <MailIcon fontSize="small" className="register__icon" />
            <input
              type="email"
              {...register('email', {
                required: 'Поле обязательно для введения!',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Неправильный email!',
                },
              })}
              className="register__input"
              placeholder="Email"
            />
            {errors?.email && <div className="error">{errors.email.message}</div>}
          </div>
          <div className="register__field">
            <KeyIcon fontSize="small" className="register__icon" />
            <input
              type={isVisible ? 'text' : 'password'}
              {...register('password', {
                required: 'Поле обязательно для введения!',
                minLength: { value: 5, message: 'Минимум 5 символов!' },
                maxLength: { value: 30, message: 'Максимум 30 символов!' },
              })}
              className="register__input"
              placeholder="Пароль"
            />
            <span onClick={() => setIsVisible(!isVisible)} className="register__visibilityIcon">
              {isVisible ? (
                <VisibilitySharpIcon fontSize="small" />
              ) : (
                <VisibilityOffSharpIcon fontSize="small" />
              )}
            </span>
            {errors?.password && <div className="error">{errors.password.message}</div>}
          </div>
          <div className="register__field">
            <AccessibilityNewSharpIcon fontSize="small" className="register__icon" />
            <input
              type="text"
              {...register('displayName', {
                required: 'Поле обязательно для введения!',
                minLength: { value: 3, message: 'Минимум 3 символа!' },
                maxLength: { value: 30, message: 'Максимум 30 символов!' },
              })}
              className="register__input"
              placeholder="Никнейм"
            />
            {errors?.displayName && <div className="error">{errors.displayName.message}</div>}
          </div>
          <button type="submit" disabled={!isValid} className="button register__submit">
            {loading ? <CircularProgress color="secondary" size="small" /> : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="social-register">
          <Link to="/login" className="social-register__register">
            Уже зарегистрированы?
          </Link>
          <h4>Войти через</h4>
          <div className="social-icons">
            <SocialSiteLogin />
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
  );
};

export default RegisterForm;
