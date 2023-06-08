import express from 'express';
import {
  activateUser,
  getUsers,
  loginFacebookUser,
  loginGoogleUser,
  loginUser,
  logoutUser,
  refresh,
  registerUser,
  updateUser,
} from '../controllers/user-controller';
import { registrationValidations } from '../services/user-service';
import auth from '../middlewares/auth-middleware';
import { UploadAvatar } from '../multer';

const usersRouter = express.Router();

usersRouter.post(
  '/registration',
  UploadAvatar.single('avatar'),
  registrationValidations,
  registerUser,
);
usersRouter.post('/login', loginUser);
usersRouter.post('/google', loginGoogleUser);
usersRouter.post('/facebook', loginFacebookUser);
usersRouter.post('/logout', logoutUser);
usersRouter.get('/activate/:link', activateUser);
usersRouter.get('/refresh', refresh);
usersRouter.get('/', auth, getUsers);
usersRouter.put('/:id', auth, UploadAvatar.single('avatar'), updateUser);

export default usersRouter;
