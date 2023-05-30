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

export interface QuestionData {
  type: string;
  text: string;
  image: Express.Multer.File | null;
  answers: AnswerData[];
}

export interface QuestionDataFinal {
  type: string;
  text: string;
  image: string | null;
  answers: AnswerData[];
}

export interface AnswerData {
  variant: string;
  isCorrect: boolean;
  description?: string;
}

export interface QuizData {
  title: string;
  category: Types.ObjectId;
  author: Types.ObjectId;
  picture: Express.Multer.File | null;
}

export interface QuizDataFinal {
  title: string;
  category: Types.ObjectId;
  author: Types.ObjectId;
  picture: string | null;
}
