import { RequestHandler } from 'express';
import { activate, registerService } from '../services/user-service';
import mongoose from 'mongoose';
import User from '../models/User';
import config from '../config';

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;
    const userData = await registerService(email, password, displayName);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.send(userData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    //
  } catch (e) {
    next(e);
  }
};
export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    //
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
    //
  } catch (e) {
    next(e);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    next(e);
  }
};
