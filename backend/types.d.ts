import { Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
  role: string;
  displayName: string;
  avatar?: string;
  googleId?: string;
  facebookID?: string;
}

export interface UserPayload {
  _id: Types.ObjectId;
  email: string;
  isActivated: boolean;
  displayName: string;
  avatar?: string;
}

export interface JWTPayload {
  _id: string;
  email: string;
  isActivated: boolean;
  role: string;
  displayName: string;
  avatar?: string;
  iat: number;
  exp: number;
}
