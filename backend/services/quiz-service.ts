import Quiz from '../models/Quiz';
import { QuizData, QuizDataToCreate } from '../types';
import Question from '../models/Question';
import { promises as fs } from 'fs';
import { ApiError } from '../exceptions/api-error';
import { Types } from 'mongoose';
import config from '../config';
import path from 'path';

export const getAllQuizzesService = async (categoryId?: string, userId?: string) => {
  let query = Quiz.find().populate([
    { path: 'category', select: 'name' },
    { path: 'author', select: 'displayName' },
    { path: 'result.user', select: 'displayName _id' },
  ]);

  if (categoryId) {
    query = query.where('category').equals(categoryId);
  }

  if (userId) {
    query = query.where('author').equals(userId);
  }

  return query.exec();
};

export const getQuizByIdService = async (id: string) => {
  const quiz = await Quiz.findById(id)
    .populate('author', 'displayName')
    .populate('category', 'name')
    .populate('result.user', '_id displayName');
  const questions = await Question.find({ quiz: id });
  return { quiz: quiz, questions: questions };
};

export const createQuizService = async (reqData: QuizDataToCreate) => {
  const createdQuiz = await Quiz.create({
    category: reqData.category,
    title: reqData.title,
    author: reqData.author,
    picture: reqData.picture,
  });

  const questionPromises = reqData.questions.map(async (questionData) => {
    const options = questionData.options.map((item) => ({
      ...item,
      isCorrect: JSON.parse(item.isCorrect),
    }));

    return await Question.create({
      quiz: createdQuiz._id,
      text: questionData.text,
      options: options,
    });
  });

  await Promise.allSettled(questionPromises);

  return createdQuiz;
};

export const deleteQuizService = async (id: string) => {
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw ApiError.NotFound('Данный квиз не найден!');
  }

  if (quiz.picture) {
    try {
      await fs.unlink(path.join(config.publicPath + quiz.picture));
    } catch (e) {
      throw ApiError.BadRequest('Произошла ошибка при удалении картинки!');
    }
  }
  await Quiz.findByIdAndDelete(id);
  await Question.deleteMany({ quiz: id });
};

export const updateQuizRatingService = async (rating: number, user: string, id: string) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw ApiError.NotFound('Данный квиз не найден!');
  }
  const existingRating = quiz.rating.find((r) => r.user.toString() === user);
  if (existingRating) {
    existingRating.ratingValue = rating;
  } else {
    await quiz.rating.push({ user: new Types.ObjectId(user), ratingValue: rating });
  }

  await quiz.save();

  return quiz;
};

export const updateQuizResultService = async (correct: number, user: string, id: string) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw ApiError.NotFound('Данный квиз не найден!');
  }
  await quiz.result.push({ user: new Types.ObjectId(user), correct: correct });

  await quiz.save();

  const updatedQuiz = await Quiz.findById(id)
    .populate('author', 'displayName')
    .populate('category', 'name')
    .populate({
      path: 'result.user',
      select: '_id displayName',
    });

  if (updatedQuiz) {
    await updatedQuiz.result.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return 0;
    });
  }
  const questions = await Question.find({ quiz: id });
  return { quiz: updatedQuiz, questions: questions };
};

export const getAllUserResultService = async (userId: string) => {
  const quizzes: QuizData[] = await Quiz.find({ 'result.user': userId }).populate(
    'result.user',
    'displayName _id',
  );

  const userResults = quizzes
    .flatMap((quiz) => {
      const userResults = quiz.result.filter((result) => result.user?._id.toString() === userId);
      return userResults.map((userResult) => ({
        quizId: quiz._id,
        quizTitle: quiz.title,
        displayName: userResult.user.displayName,
        correct: userResult.correct,
        createdAt: userResult.createdAt,
      }));
    })
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return 0;
    });

  return userResults;
};
