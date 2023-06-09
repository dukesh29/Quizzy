import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryService,
  getCategoryServiceById,
} from '../services/category-service';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/api-error';

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const data = await getCategoryService();
    return res.send(data);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};

export const getCategoryById: RequestHandler = async (req, res, next) => {
  try {
    const data = await getCategoryServiceById(req.params.id);
    return res.send(data);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации', errors.array() as []));
    }
    const { name } = req.body;
    const data = await createCategoryService(name);
    return res.send(data);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    await deleteCategoryService(req.params.id);
    return res.status(204).send('Категория успешно удалена!');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
};
