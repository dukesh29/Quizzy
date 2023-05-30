import express from 'express';
import auth from '../middlewares/auth-middleware';
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
  getCategoryById,
} from '../controllers/category-controller';
import permit from '../middlewares/permit-middleware';
import { createCategoryValidator } from '../services/category-service';

const categoriesRouter = express.Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.get('/:id', getCategoryById);
categoriesRouter.post('/create', auth, permit('admin'), createCategoryValidator, createCategory);
categoriesRouter.put('/edit', auth, permit('admin'), createCategoryValidator, editCategory);
categoriesRouter.delete('/delete', auth, permit('admin'), deleteCategory);

export default categoriesRouter;
