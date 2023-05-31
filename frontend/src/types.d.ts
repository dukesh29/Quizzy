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
