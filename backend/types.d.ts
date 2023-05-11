import { Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
  role: string;
  displayName: string;
}

export interface UserPayload {
  _id: Types.ObjectId;
  email: string;
  isActivated: boolean;
  displayName: string;
}

interface ErrorObject {
  code: number;
  message: string;
}
