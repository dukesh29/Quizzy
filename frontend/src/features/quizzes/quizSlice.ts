import { MyResultType, QuizData, QuizFromDB, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getOneQuiz,
  getUserResults,
  updateQuizRating,
  updateQuizResult,
} from './quizThunk';

interface QuizState {
  items: QuizData[] | null;
  oneQuiz: QuizFromDB | null;
  allQuizLoading: boolean;
  oneQuizLoading: boolean;
  createQuizError: ValidationError | null;
  createQuizLoading: boolean;
  deleteQuizLoading: boolean;
  quizResult: number;
  QuizResults: MyResultType[] | null;
  getUserResultLoading: boolean;
}

const initialState: QuizState = {
  items: null,
  oneQuiz: null,
  allQuizLoading: false,
  oneQuizLoading: false,
  createQuizError: null,
  createQuizLoading: false,
  deleteQuizLoading: false,
  quizResult: 0,
  QuizResults: null,
  getUserResultLoading: false,
};

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    addResult: (state) => {
      state.quizResult = state.quizResult + 1;
    },
    unsetResult: (state) => {
      state.quizResult = 0;
    },
  },
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
      state.quizResult = 0;
      state.oneQuiz = null;
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
    builder.addCase(updateQuizRating.fulfilled, (state, action) => {
      const { id, rating } = action.payload;
      const quiz = state.items && state.items.find((q) => q._id === id);
      if (quiz) {
        quiz.rating = rating;
      }
    });
    builder.addCase(updateQuizResult.fulfilled, (state, action) => {
      const quiz = action.payload;
      state.oneQuiz = action.payload;
      const findOneQuiz = state.items && state.items.find((q) => q._id === quiz._id);
      if (findOneQuiz) {
        findOneQuiz.result = quiz.result;
      }
    });
    builder.addCase(getUserResults.pending, (state) => {
      state.getUserResultLoading = true;
    });
    builder.addCase(getUserResults.fulfilled, (state, { payload: results }) => {
      state.getUserResultLoading = false;
      state.QuizResults = results;
    });
    builder.addCase(getUserResults.rejected, (state) => {
      state.getUserResultLoading = false;
    });
  },
});

export const quizReducer = quizSlice.reducer;

export const { addResult, unsetResult } = quizSlice.actions;

export const selectQuizzes = (state: RootState) => state.quiz.items;
export const selectQuizzesLoading = (state: RootState) => state.quiz.allQuizLoading;
export const selectOneQuizData = (state: RootState) => state.quiz.oneQuiz;
export const selectOneQuizLoading = (state: RootState) => state.quiz.oneQuizLoading;
export const selectCreateQuizLoading = (state: RootState) => state.quiz.createQuizLoading;
export const selectCreateQuizError = (state: RootState) => state.quiz.createQuizError;
export const selectDeleteQuizLoading = (state: RootState) => state.quiz.deleteQuizLoading;
export const selectResult = (state: RootState) => state.quiz.quizResult;
export const selectUserResults = (state: RootState) => state.quiz.QuizResults;
export const selectUserResultsLoading = (state: RootState) => state.quiz.getUserResultLoading;
