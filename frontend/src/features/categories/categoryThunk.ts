import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import axiosApi from '../../axios';
import { Category, CategoryMutation, GlobalError, ValidationError } from '../../types';

export const fetchCategories = createAsyncThunk<Category[]>(
  'categories/fetch_categories',
  async () => {
    const response = await axiosApi.get<Category[]>('/categories');
    return response.data;
  },
);

export const createCategory = createAsyncThunk<
  void,
  CategoryMutation,
  { rejectValue: ValidationError }
>('categories/create_category', async (categoryMutation, { rejectWithValue }) => {
  try {
    await axiosApi.post('/categories/create', categoryMutation);
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const deleteCategory = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'categories/delete_category',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosApi.delete('/categories/delete/' + id);
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
