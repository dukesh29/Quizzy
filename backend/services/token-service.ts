import jwt from 'jsonwebtoken';
import config from '../config';
import Token from '../models/Token';
import { UserPayload } from '../types';

export const generateTokens = (payload: UserPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.jwtAccessSecret, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, config.jwt.jwtAccessSecret, { expiresIn: '30d' });
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
