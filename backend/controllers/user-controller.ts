import { RequestHandler } from 'express';
import {
  activate,
  getAllUsersService,
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from '../services/user-service';
import config from '../config';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/api-error';

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации', errors.array() as []));
    }
    const { email, password, displayName } = req.body;
    const userData = await registerService(email, password, displayName);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.send(userData);
  } catch (e) {
    next(e);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await loginService(email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.send(userData);
  } catch (e) {
    next(e);
  }
};
export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutService(refreshToken);
    res.clearCookie('refreshToken');
    return res.status(200).send('Вы успешно вышли из  аккаунта!');
  } catch (e) {
    next(e);
  }
};

export const activateUser: RequestHandler = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    await activate(activationLink);
    return res.redirect(config.clientURL);
  } catch (e) {
    next(e);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await refreshTokenService(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.send(userData);
  } catch (e) {
    next(e);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.send(users);
  } catch (e) {
    next(e);
  }
};
