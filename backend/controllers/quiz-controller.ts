import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/api-error';
import { promises as fs } from 'fs';
import {
  createQuizService,
  deleteQuizService,
  getAllQuizzesService,
  getAllUserResultService,
  getQuizByIdService,
  updateQuizRatingService,
  updateQuizResultService,
} from '../services/quiz-service';
import { QuizDataToCreate } from '../types';

export const getAllQuizzes: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = req.query.category as string;
    const userId = req.query.user as string;
    const quizzes = await getAllQuizzesService(categoryId, userId);
    return res.send(quizzes);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};

export const getQuizById: RequestHandler = async (req, res, next) => {
  try {
    const oneQuiz = await getQuizByIdService(req.params.id);
    return res.send(oneQuiz);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};

export const createQuiz: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации', errors.array() as []));
    }
    const data = req.body;

    const reqData: QuizDataToCreate = {
      ...data,
      picture: req.file ? 'images/quiz/' + req.file.filename : null,
    };

    const oneQuiz = await createQuizService(reqData);
    return res.send(oneQuiz);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};

export const updateQuizRating: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { rating, user } = req.body;
    const quiz = await updateQuizRatingService(rating, user, id);
    return res.send({ id: quiz._id, rating: quiz.rating });
  } catch (e) {
    next(e);
  }
};

export const updateQuizResult: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { user, correct } = req.body;
    const quiz = await updateQuizResultService(correct, user, id);
    return res.send(quiz);
  } catch (e) {
    next(e);
  }
};

export const getAllUserResults: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const results = await getAllUserResultService(id);
    return res.send(results);
  } catch (e) {
    next(e);
  }
};

export const deleteQuiz: RequestHandler = async (req, res, next) => {
  try {
    await deleteQuizService(req.params.id);
    return res.status(204).send('Квиз успешно удален!');
  } catch (error) {
    next(error);
  }
};
