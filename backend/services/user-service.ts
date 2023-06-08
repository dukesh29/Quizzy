import User from '../models/User';
import { sendActivationMail } from './mail-service';
import {
  findToken,
  generateTokens,
  removeToken,
  saveToken,
  validateRefreshToken,
} from './token-service';
import { ApiError } from '../exceptions/api-error';
import { body } from 'express-validator';
import * as crypto from 'crypto';
import axios from 'axios';
import { ProfileSuccessResponse } from '../types';

const registrationValidators = [
  body('email').isEmail().withMessage('Неверный email! Введите правильный email!'),
  body('password')
    .isLength({ min: 5, max: 30 })
    .withMessage('Пароль должен иметь от 5 до 30 символов!')
    .isString()
    .withMessage('Пароль должен быть строкой!'),
  body('displayName')
    .isLength({ min: 3, max: 30 })
    .withMessage('Никнейм должен иметь от 3 до 30 символов!')
    .isString()
    .withMessage('Никнейм должен быть строкой!'),
];

export const registrationValidations = [...registrationValidators];

export const registerService = async (
  email: string,
  password: string,
  displayName: string,
  avatar: string | null,
) => {
  const activationLink = crypto.randomUUID();
  await sendActivationMail(email, `${process.env.API_URL}/api/users/activate/${activationLink}`);
  const user = await User.create({
    email,
    password,
    displayName,
    activationLink,
    avatar: avatar !== null ? avatar : null,
  });
  const newUser = user.toJSON();
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser._id.toString(), tokens.refreshToken);

  return {
    ...tokens,
    user: newUser,
  };
};

export const activate = async (activationLink: string) => {
  const user = await User.findOne({ activationLink: activationLink });
  if (!user) {
    throw new ApiError(401, 'Данная ссылка не действительна!');
  }
  user.isActivated = true;
  await user.save();
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest('Пользователь с таким email не найден!');
  }

  const isMatch = await user.checkPassword(password);

  if (!isMatch) {
    throw ApiError.BadRequest('Неверный email или пароль!');
  }

  const newUser = user.toJSON();
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser._id.toString(), tokens.refreshToken);
  return {
    ...tokens,
    user: newUser,
  };
};

export const googleLoginService = async (googleAccessToken: string) => {
  const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
    },
  });

  if (!response) {
    throw ApiError.BadRequest('Неверный токен от Google!');
  }

  const { email, sub, name, picture } = response.data;

  if (!email) {
    throw ApiError.BadRequest('Недостоверные данные от Google!');
  }

  let user = await User.findOne({ googleId: sub });

  if (!user) {
    user = await User.create({
      email,
      password: crypto.randomUUID(),
      displayName: name,
      googleId: sub,
      avatar: picture,
      isActivated: true,
    });
  }

  const newUser = user.toJSON();
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser._id.toString(), tokens.refreshToken);

  return {
    ...tokens,
    user: newUser,
  };
};

export const facebookLoginService = async (data: ProfileSuccessResponse) => {
  if (!data) {
    throw ApiError.BadRequest('Неверные данные от Facebook!');
  }

  const {
    email,
    id,
    name,
    picture: {
      data: { url },
    },
  } = data;

  let user = await User.findOne({ facebookID: id });

  if (!user) {
    user = await User.create({
      email,
      password: crypto.randomUUID(),
      displayName: name,
      facebookID: id,
      avatar: url,
      isActivated: true,
    });
  }

  const newUser = user.toJSON();
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser._id.toString(), tokens.refreshToken);

  return {
    ...tokens,
    user: newUser,
  };
};

export const logoutService = async (refreshToken: string) => {
  await removeToken(refreshToken);
};

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);
  if (!userData || !tokenFromDB) {
    throw ApiError.UnauthorizedError();
  }
  const user = await User.findById(userData._id);
  if (!user) {
    throw ApiError.BadRequest('Такой пользователь не найден!');
  }
  const newUser = user.toJSON();
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser._id.toString(), tokens.refreshToken);
  return {
    ...tokens,
    user: newUser,
  };
};

export const getAllUsersService = async () => {
  return User.find();
};
