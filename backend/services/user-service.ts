import User from '../models/User';
import * as crypto from 'crypto';
import { sendActivationMail } from './mail-service';
import { generateTokens, saveToken } from './token-service';
import { ApiError } from '../exceptions/api-error';
import { body } from 'express-validator';

const registrationValidators = [
  body('email').isEmail().withMessage('Неверный email! Введите правильный email!'),
  body('password')
    .isLength({ min: 3, max: 32 })
    .withMessage('Пароль должен иметь от 3 до 32 символов!')
    .isString()
    .withMessage('Пароль должен быть строкой!'),
  body('displayName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Никнейм должен иметь от 2 до 50 символов!')
    .isString()
    .withMessage('Никнейм должен быть строкой!'),
];

export const registrationValidations = [...registrationValidators];

export const registerService = async (email: string, password: string, displayName: string) => {
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw new ApiError(401, 'Пользователь с данным email уже существует!');
  }
  const activationLink = crypto.randomUUID();
  await sendActivationMail(email, `${process.env.API_URL}/api/users/activate/${activationLink}`);

  const user = await User.create({ email, password, displayName, activationLink });
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
