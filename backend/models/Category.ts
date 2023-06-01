import { model, Schema } from 'mongoose';
import { ICategory } from '../types';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (this: ICategory, name: string): Promise<boolean> {
        const cat: ICategory | null = await Category.findOne({
          name,
        });
        return !cat;
      },
      message: 'Данная категория уже существует!',
    },
  },
});

const Category = model('Category', CategorySchema);

export default Category;
