import Category from '../models/Category';
import { ApiError } from '../exceptions/api-error';
import { body } from 'express-validator';
import Quiz from '../models/Quiz';

export const createCategoryValidator = body('name')
  .isEmpty()
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
  return await Category.create({ name });
};

export const editCategoryService = (id: string) => {
  return Category.findByIdAndUpdate(id);
};

export const deleteCategoryService = async (id: string) => {
  const quizzes = await Quiz.find({ category: id });
  if (quizzes) {
    throw ApiError.Forbidden('Данную категорию нельзя удалить!');
  }
  await Category.findByIdAndDelete(id);
};
