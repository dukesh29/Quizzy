import jwt from 'jsonwebtoken';
import config from '../config';
import Token from '../models/Token';
import { JWTPayload, UserPayload } from '../types';

export const generateTokens = (payload: UserPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.jwtAccessSecret, { expiresIn: '30s' });
  const refreshToken = jwt.sign(payload, config.jwt.jwtRefreshSecret, { expiresIn: '30d' });
  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId: string, refreshToken: string) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  return await Token.create({ user: userId, refreshToken });
};

export const validateAccessToken = (token: string) => {
  try {
    const userData = jwt.verify(token, config.jwt.jwtAccessSecret);
    return userData as JWTPayload;
  } catch (e) {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    const userData = jwt.verify(token, config.jwt.jwtRefreshSecret);
    return userData as JWTPayload;
  } catch (e) {
    return null;
  }
};

export const removeToken = async (refreshToken: string) => {
  await Token.deleteOne({ refreshToken });
};

export const findToken = async (refreshToken: string) => {
  return Token.findOne({ refreshToken });
};
