import { RequestHandler } from 'express';
import {
  activate,
  facebookLoginService,
  getAllUsersService,
  googleLoginService,
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from '../services/user-service';
import config from '../config';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/api-error';
import mongoose from 'mongoose';
import User from '../models/User';
import { promises as fs } from 'fs';
import path from 'path';

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации', errors.array() as []));
    }

    const avatar = req.file ? 'images/avatars/' + req.file.filename : null;
    const { email, password, displayName } = req.body;
    const userData = await registerService(email, password, displayName, avatar);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const data = {
      accessToken: userData.accessToken,
      user: userData.user,
    };
    return res.send(data);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
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
    return res.send({
      accessToken: userData.accessToken,
      user: userData.user,
    });
  } catch (e) {
    next(e);
  }
};

export const loginGoogleUser: RequestHandler = async (req, res, next) => {
  try {
    const googleAccessToken = req.body.accessToken;
    const userData = await googleLoginService(googleAccessToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.send({
      accessToken: userData.accessToken,
      user: userData.user,
    });
  } catch (e) {
    next(e);
  }
};

export const loginFacebookUser: RequestHandler = async (req, res, next) => {
  try {
    const userData = await facebookLoginService(req.body.data);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.send({
      accessToken: userData.accessToken,
      user: userData.user,
    });
  } catch (e) {
    next(e);
  }
};

export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
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
    const refreshToken = req.cookies.refreshToken;
    const userData = await refreshTokenService(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.send({
      accessToken: userData.accessToken,
      user: userData.user,
    });
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

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { email, displayName, password } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ error: 'Пользователь не найден.' });
    }

    if (email && email !== user.email) {
      user.email = email;
    }
    if (displayName && displayName !== user.displayName) {
      user.displayName = displayName;
    }
    if (password) {
      user.password = password;
    }

    if (req.file) {
      const avatar = '/images/avatars/' + req.file.filename;
      if (user.avatar && user.avatar.includes('images')) {
        await fs.unlink(path.join(config.publicPath, user.avatar));
      }
      user.avatar = avatar;
    }

    const result = await user.save();

    return res.send({ message: 'Пользователь успешно отредактирован!', result });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }
};
