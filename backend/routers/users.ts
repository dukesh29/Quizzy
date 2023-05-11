import express from 'express';
import {
  activateUser,
  getUsers,
  loginUser,
  logoutUser,
  refresh,
  registerUser,
} from '../controllers/user-controller';

const usersRouter = express.Router();

usersRouter.post('/registration', registerUser);
usersRouter.post('/login', loginUser);
usersRouter.post('/logout', logoutUser);
usersRouter.get('/activate/:link', activateUser);
usersRouter.get('/refresh', refresh);
usersRouter.get('/', getUsers);

export default usersRouter;
