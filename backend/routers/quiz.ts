import express from 'express';
import {
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuizRating,
} from '../controllers/quiz-controller';
import auth from '../middlewares/auth-middleware';
import { UploadImage } from '../multer';

const quizRouter = express.Router();

quizRouter.get('/', getAllQuizzes);
quizRouter.get('/:id', getQuizById);
quizRouter.post('/', auth, UploadImage.single('picture'), createQuiz);
quizRouter.patch('/:id/rating', auth, updateQuizRating);
quizRouter.delete('/:id', auth, deleteQuiz);

export default quizRouter;
