import express from 'express';
import {
  activateUser,
  getUsers,
  loginUser,
  logoutUser,
  refresh,
  registerUser,
} from '../controllers/user-controller';
import { registrationValidations } from '../services/user-service';
import auth from '../middlewares/auth-middleware';

const usersRouter = express.Router();

usersRouter.post('/registration', registrationValidations, registerUser);
usersRouter.post('/login', loginUser);
usersRouter.post('/logout', logoutUser);
usersRouter.get('/activate/:link', activateUser);
usersRouter.get('/refresh', refresh);
usersRouter.get('/', auth, getUsers);

export default usersRouter;
