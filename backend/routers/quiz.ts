import express from 'express';
import {
  createQuiz,
  deleteQuiz,
  editQuiz,
  getAllQuiz,
  getQuizById,
} from '../controllers/quiz-controller';
import auth from '../middlewares/auth-middleware';
import { imagesUpload } from '../multer';

const quizRouter = express.Router();

quizRouter.get('/', getAllQuiz);
quizRouter.get('/:id', getQuizById);
quizRouter.post(
  '/',
  auth,
  imagesUpload.fields([{ name: 'quizImage', maxCount: 1 }, { name: 'questionImage' }]),
  createQuiz,
);
quizRouter.put('/:id', auth, editQuiz);
quizRouter.delete('/:id', auth, deleteQuiz);

export default quizRouter;
