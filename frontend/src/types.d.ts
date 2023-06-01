export interface User {
  _id: string;
  email: string;
  displayName: string;
  role: string;
  isActivated: boolean;
  avatar?: string;
}

export interface UserMutation {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface UserResponse {
  accessToken: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface GlobalError {
  message: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface CategoryMutation {
  name: string;
}

export interface QuizDataMutation {
  title: string;
  category: string;
  picture: File | null;
  author: string | null;
}

export interface Option {
  variant: string;
  isCorrect: boolean;
}

export interface QuestionDataMutation {
  text: string;
  options: Option[];
}

export interface QuizItemMutation {
  quiz: QuizDataMutation;
  questions: QuestionDataMutation[];
}

export interface QuizData {
  _id: string;
  title: string;
  category: string;
  picture: string | null;
  author: string;
  createdAt: Date;
}

export interface QuestionData {
  _id: string;
  quiz: string;
  text: string;
  options: Option[];
}

export interface Quiz {
  quiz: QuizData;
  questions: QuestionData[];
}
