import Quiz from '../models/Quiz';
import { QuestionDataFinal, QuizDataFinal } from '../types';
import Question from '../models/Question';

export const getAllQuizService = async (categoryId?: string) => {
  if (categoryId) {
    return Quiz.find({ category: categoryId }).populate('questions');
  }
  return Quiz.find().populate('questions');
};

export const getQuizByIdService = (id: string) => {
  return Quiz.findById(id).populate('questions');
};

export const createQuizService = async (
  quizData: QuizDataFinal,
  questions: QuestionDataFinal[],
) => {
  const quiz = await Quiz.create({
    title: quizData.title,
    author: quizData.author,
    category: quizData.category,
    picture: quizData.picture,
  });

  const questionPromises = questions.map(async (q) => {
    await Question.create({
      quiz: quiz._id,
      text: q.text,
      answers: q.answers,
      type: q.type,
      image: q.image ? q.image : null,
    });
  });

  await Promise.all(questionPromises);

  return quiz;
};

export const editQuizService = (id: string) => {};

export const deleteQuizService = (id: string) => {};
