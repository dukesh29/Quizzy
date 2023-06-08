import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCategoriesList, selectGetAllCategoryLoading } from './categorySlice';
import CategoryForm from './components/categoryForm';
import CategoryCard from './components/categoryCard';
import { fetchCategories } from './categoryThunk';
import { CircularProgress } from '@mui/material';

const CreateCategory = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategoriesList);
  const loading = useAppSelector(selectGetAllCategoryLoading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="category">
      <h2 className="category__title">Создание категории</h2>
      <CategoryForm />
      <div className="category__cards">
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          categories.map((item) => <CategoryCard category={item} key={item._id} />)
        )}
      </div>
    </div>
  );
};

export default CreateCategory;
