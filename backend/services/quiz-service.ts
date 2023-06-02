import Quiz from '../models/Quiz';
import { QuizDataToCreate } from '../types';
import Question from '../models/Question';
import { promises as fs } from 'fs';
import { ApiError } from '../exceptions/api-error';

export const getAllQuizzesService = async (categoryId?: string, userId?: string) => {
  let query = Quiz.find().populate([
    { path: 'category', select: 'name' },
    { path: 'author', select: 'displayName' },
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
    .populate('category', 'name');
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
    ApiError.NotFound('Данный квиз не найден!');
  } else {
    if (quiz.picture) {
      await fs.unlink(quiz.picture);
    }
    await Quiz.findByIdAndDelete(id);
    await Question.deleteMany({ quiz: id });
  }
};
