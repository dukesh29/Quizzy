import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCategoriesList } from './categorySlice';
import CategoryForm from './components/categoryForm';
import CategoryCard from './components/categoryCard';
import { fetchCategories } from './categoryThunk';

const CreateCategory = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategoriesList);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="category">
      <h2 className="category__title">Создание категории</h2>
      <CategoryForm />
      <div className="category__cards">
        {categories.map((item) => (
          <CategoryCard category={item} key={item._id} />
        ))}
      </div>
    </div>
  );
};

export default CreateCategory;
