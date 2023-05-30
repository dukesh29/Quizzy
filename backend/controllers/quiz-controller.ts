import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/api-error';
import {
  createQuizService,
  deleteQuizService,
  editQuizService,
  getAllQuizService,
  getQuizByIdService,
} from '../services/quiz-service';
import { QuestionData, QuestionDataFinal, QuizData, QuizDataFinal } from '../types';

export const getAllQuiz: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = req.query.category as string | undefined;
    const quizzes = await getAllQuizService(categoryId);
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
    const files = req.files as { [filename: string]: Express.Multer.File[] };
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации', errors.array() as []));
    }
    const quizData: QuizData = req.body.quizData;

    const quizDataToSend: QuizDataFinal = {
      ...quizData,
      picture:
        req.files && files['quizImage'][0].filename
          ? 'images/quiz/' + files['quizImage'][0].filename
          : null,
    };

    const questionsData: QuestionData[] = req.body.questions;
    const questionsToCreate: QuestionDataFinal[] = questionsData.map((item, index) => {
      const questionImageFile = req.files && files['questionImage'];
      const questionImage =
        questionImageFile && questionImageFile[index]
          ? 'images/question/' + questionImageFile[index].filename
          : null;

      return {
        ...item,
        image: questionImage,
      };
    });

    const oneQuiz = await createQuizService(quizDataToSend, questionsToCreate);
    return res.send(oneQuiz);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};

export const editQuiz: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации', errors.array() as []));
    }
    const { title, questions } = req.body;
    const oneQuiz = await editQuizService(title);
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
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};
