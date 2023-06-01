import Quiz from '../models/Quiz';
import { Query, QuizDataToCreate } from '../types';
import Question from '../models/Question';

export const getAllQuizzesService = async (category?: string, user?: string) => {
  const query: Query = {};

  if (category && user) {
    query['category'] = category;
    query['author'] = user;
  } else if (category) {
    query['category'] = category;
  } else if (user) {
    query['author'] = user;
  }

  return Quiz.find(query).populate('questions');
};

export const getQuizByIdService = (id: string) => {
  return Quiz.findById(id).populate('questions');
};
export const createQuizService = async (reqData: QuizDataToCreate) => {
  const createdQuiz = await Quiz.create({
    category: reqData.category,
    title: reqData.category,
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
  await Question.deleteMany({ quiz: id });
  await Quiz.findByIdAndDelete(id);
};
