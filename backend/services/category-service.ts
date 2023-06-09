import Category from '../models/Category';
import { ApiError } from '../exceptions/api-error';
import { body } from 'express-validator';
import Quiz from '../models/Quiz';

export const createCategoryValidator = body('name')
  .notEmpty()
  .withMessage('Поле обязательно для введения!');

export const getCategoryService = () => {
  const categories = Category.find();
  if (!categories) {
    throw ApiError.NotFound('Категории не найдены');
  }
  return categories;
};

export const getCategoryServiceById = (id: string) => {
  const category = Category.findById(id);
  if (!category) {
    throw ApiError.NotFound('Данная категория не найдена!');
  }
  return category;
};

export const createCategoryService = async (name: string) => {
  return await Category.create({ name: name });
};

export const deleteCategoryService = async (id: string) => {
  const quizzes = await Quiz.find({ category: id });
  if (quizzes.length > 0) {
    throw ApiError.Forbidden('Данную категорию нельзя удалить, так как она связана с квизами.');
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw ApiError.NotFound('Категория не найдена.');
  }

  return category;
};
