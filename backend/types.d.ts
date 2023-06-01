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

export type ProfileSuccessResponse = {
  id?: string;
  email?: string;
  name?: string;
  picture: {
    data: {
      url: string;
    };
  };
};

export interface OptionFormData {
  variant: string;
  isCorrect: string;
}

export interface QuizDataToCreate {
  title: string;
  category: Types.ObjectId;
  author: Types.ObjectId;
  picture: string | null;
  questions: QuestionDataCreate[];
}

export interface QuestionDataCreate {
  text: string;
  options: OptionFormData[];
}

export interface Query {
  category?: string;
  author?: string;
}
