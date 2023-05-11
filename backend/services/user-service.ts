import User from '../models/User';
import * as crypto from 'crypto';
import { sendActivationMail } from './mail-service';
import { generateTokens, saveToken } from './token-service';

export const registerService = async (email: string, password: string, displayName: string) => {
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw new Error(`Пользователь с данным почтовым адресом уже существует!`);
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
    throw new Error('Некорректная ссылка активации');
  }
  user.isActivated = true;
  await user.save();
};
