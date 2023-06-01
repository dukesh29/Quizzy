import { Quiz, QuizData, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createQuiz, deleteQuiz, getAllQuizzes, getOneQuiz } from './quizThunk';

interface QuizState {
  items: QuizData[] | null;
  oneQuiz: Quiz | null;
  allQuizLoading: boolean;
  oneQuizLoading: boolean;
  createQuizError: ValidationError | null;
  createQuizLoading: boolean;
  deleteQuizLoading: boolean;
}

const initialState: QuizState = {
  items: null,
  oneQuiz: null,
  allQuizLoading: false,
  oneQuizLoading: false,
  createQuizError: null,
  createQuizLoading: false,
  deleteQuizLoading: false,
};

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllQuizzes.pending, (state) => {
      state.allQuizLoading = true;
    });
    builder.addCase(getAllQuizzes.fulfilled, (state, { payload: quizzes }) => {
      state.items = quizzes;
      state.allQuizLoading = false;
    });
    builder.addCase(getAllQuizzes.rejected, (state) => {
      state.allQuizLoading = false;
    });
    builder.addCase(getOneQuiz.pending, (state) => {
      state.oneQuizLoading = true;
    });
    builder.addCase(getOneQuiz.fulfilled, (state, { payload: quiz }) => {
      state.oneQuiz = quiz;
      state.oneQuizLoading = false;
    });
    builder.addCase(getOneQuiz.rejected, (state) => {
      state.oneQuizLoading = false;
    });
    builder.addCase(createQuiz.pending, (state) => {
      state.createQuizLoading = true;
    });
    builder.addCase(createQuiz.fulfilled, (state) => {
      state.createQuizLoading = false;
    });
    builder.addCase(createQuiz.rejected, (state, { payload: error }) => {
      state.createQuizLoading = false;
      state.createQuizError = error || null;
    });
    builder.addCase(deleteQuiz.pending, (state) => {
      state.deleteQuizLoading = true;
    });
    builder.addCase(deleteQuiz.fulfilled, (state) => {
      state.deleteQuizLoading = false;
    });
    builder.addCase(deleteQuiz.rejected, (state) => {
      state.deleteQuizLoading = false;
    });
  },
});

export const quizReducer = quizSlice.reducer;

export const selectQuizzes = (state: RootState) => state.quiz.items;
export const selectQuizzesLoading = (state: RootState) => state.quiz.allQuizLoading;
export const selectOneQuizData = (state: RootState) => state.quiz.oneQuiz;
export const selectOneQuizLoading = (state: RootState) => state.quiz.oneQuizLoading;
export const selectCreateQuizLoading = (state: RootState) => state.quiz.createQuizLoading;
export const selectCreateQuizError = (state: RootState) => state.quiz.createQuizError;
export const selectDeleteQuizLoading = (state: RootState) => state.quiz.deleteQuizLoading;
