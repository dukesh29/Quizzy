import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/api-error';
import {
  createQuizService,
  deleteQuizService,
  getAllQuizzesService,
  getQuizByIdService,
} from '../services/quiz-service';
import { QuizDataToCreate } from '../types';

export const getAllQuizzes: RequestHandler = async (req, res, next) => {
  try {
    const { category, user } = req.query;
    const quizzes = await getAllQuizzesService(category as string, user as string);
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
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
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
