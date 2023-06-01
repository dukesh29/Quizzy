import express from 'express';
import auth from '../middlewares/auth-middleware';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} from '../controllers/category-controller';
import permit from '../middlewares/permit-middleware';
import { createCategoryValidator } from '../services/category-service';

const categoriesRouter = express.Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.get('/:id', getCategoryById);
categoriesRouter.post('/create', auth, createCategoryValidator, createCategory);
categoriesRouter.delete('/delete', auth, permit('admin'), deleteCategory);

export default categoriesRouter;
