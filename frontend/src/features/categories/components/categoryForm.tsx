import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createCategory, fetchCategories } from '../categoryThunk';
import { selectCreateCategoryLoading } from '../categorySlice';
import { Button, CircularProgress, TextField } from '@mui/material';

const CategoryForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectCreateCategoryLoading);

  const [categoryName, setCategoryName] = useState('');

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createCategory({ name: categoryName }));
    dispatch(fetchCategories());
    setCategoryName('');
  };

  return (
    <form onSubmit={handleSubmit} className="category__form">
      <TextField
        id="outlined-basic"
        color="secondary"
        value={categoryName}
        onChange={handleCategoryNameChange}
        label="Название категории"
        variant="outlined"
      />
      <Button variant="outlined" color="secondary" type="submit" disabled={loading}>
        {loading ? <CircularProgress size="small" /> : 'Создать категорию'}
      </Button>
    </form>
  );
};

export default CategoryForm;
