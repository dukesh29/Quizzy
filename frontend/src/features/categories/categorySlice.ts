import { createSlice } from '@reduxjs/toolkit';
import { Category, ValidationError } from '../../types';
import { createCategory, deleteCategory, fetchCategories } from './categoryThunk';
import { RootState } from '../../app/store';

interface categoryState {
  items: Category[];
  getAllCategoriesLoading: boolean;
  createCategoryLoading: boolean;
  deleteCategoryLoading: boolean;
  categoryError: ValidationError | null;
}

const initialState: categoryState = {
  items: [],
  getAllCategoriesLoading: false,
  createCategoryLoading: false,
  deleteCategoryLoading: false,
  categoryError: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.getAllCategoriesLoading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, { payload: categories }) => {
      state.getAllCategoriesLoading = false;
      state.items = categories;
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.getAllCategoriesLoading = false;
    });

    builder.addCase(createCategory.pending, (state) => {
      state.categoryError = null;
      state.createCategoryLoading = true;
    });
    builder.addCase(createCategory.fulfilled, (state) => {
      state.createCategoryLoading = false;
    });
    builder.addCase(createCategory.rejected, (state, { payload: error }) => {
      state.createCategoryLoading = false;
      state.categoryError = error || null;
    });

    builder.addCase(deleteCategory.pending, (state) => {
      state.deleteCategoryLoading = true;
    });
    builder.addCase(deleteCategory.fulfilled, (state) => {
      state.deleteCategoryLoading = false;
    });
    builder.addCase(deleteCategory.rejected, (state) => {
      state.deleteCategoryLoading = false;
    });
  },
});

export const categoryReducer = categorySlice.reducer;
export const selectCategoriesList = (state: RootState) => state.category.items;
export const selectGetAllCategoryLoading = (state: RootState) =>
  state.category.getAllCategoriesLoading;
export const selectCreateCategoryLoading = (state: RootState) =>
  state.category.createCategoryLoading;
export const selectDeleteCategoryLoading = (state: RootState) =>
  state.category.deleteCategoryLoading;
export const selectCategoryError = (state: RootState) => state.category.categoryError;
