import { createAsyncThunk } from '@reduxjs/toolkit';
import { QuizData, QuizFromDB, QuizItemMutation, ValidationError } from '../../types';
import axiosApi from '../../axios';
import { isAxiosError } from 'axios';

export const getAllQuizzes = createAsyncThunk<QuizData[], string | undefined>(
  'quizzes/getAll',
  async (query) => {
    const url = query ? `/quiz?${query}` : '/quiz';
    const response = await axiosApi.get<QuizData[]>(url);
    return response.data;
  },
);

export const getOneQuiz = createAsyncThunk<QuizFromDB, string>('quizzes/getOne', async (id) => {
  const response = await axiosApi.get<QuizFromDB>(`/quiz/${id}`);
  return response.data;
});

export const createQuiz = createAsyncThunk<
  void,
  QuizItemMutation,
  { rejectValue: ValidationError }
>('quizzes/createQuiz', async (quizItemMutation, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('category', quizItemMutation.quiz.category);
    formData.append('title', quizItemMutation.quiz.title);
    if (quizItemMutation.quiz.author) {
      formData.append('author', quizItemMutation.quiz.author);
    }
    if (quizItemMutation.quiz.picture) {
      formData.append('picture', quizItemMutation.quiz.picture);
    }

    quizItemMutation.questions.forEach((question, index) => {
      formData.append(`questions[${index}][text]`, question.text);
      question.options.forEach((option, optionIndex) => {
        formData.append(`questions[${index}][options][${optionIndex}][variant]`, option.variant);
        formData.append(
          `questions[${index}][options][${optionIndex}][isCorrect]`,
          JSON.stringify(option.isCorrect),
        );
      });
    });

    await axiosApi.post('/quiz', formData);
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const deleteQuiz = createAsyncThunk<void, string>('quizzes/deleteQuiz', async (id) => {
  await axiosApi.delete('/quiz/' + id);
});
