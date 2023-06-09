import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createCategory, fetchCategories } from '../categoryThunk';
import { selectCategoryError, selectCreateCategoryLoading } from '../categorySlice';
import { Button, CircularProgress, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

const CategoryForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectCreateCategoryLoading);
  const error = useAppSelector(selectCategoryError);
  const [categoryName, setCategoryName] = useState(() => {
    const saved = localStorage.getItem('categoryData');
    return saved ? JSON.parse(saved) : '';
  });

  useEffect(() => {
    localStorage.setItem('categoryData', JSON.stringify(categoryName));
  }, [categoryName]);

  useEffect(() => {
    localStorage.removeItem('categoryData');
  }, []);

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createCategory({ name: categoryName })).unwrap();
      dispatch(fetchCategories());
      enqueueSnackbar('Категория успешно создана! ', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      setCategoryName('');
    } catch (e) {
      enqueueSnackbar('Что то пошло не так! ', { variant: 'error', autoHideDuration: 3000 });
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category__form">
      <TextField
        id="outlined-basic"
        sx={{ maxWidth: '500px' }}
        fullWidth
        color="secondary"
        value={categoryName}
        onChange={handleCategoryNameChange}
        label="Название категории"
        variant="outlined"
        error={Boolean(getFieldError('name'))}
        required
        helperText={getFieldError('name')}
      />
      <Button
        variant="outlined"
        sx={{ color: '#776BCC', border: '1px solid #776BCC' }}
        type="submit"
        disabled={loading}
      >
        {loading ? <CircularProgress color="secondary" size="small" /> : 'Создать категорию'}
      </Button>
    </form>
  );
};

export default CategoryForm;
