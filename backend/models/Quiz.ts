import { model, Schema, Types } from 'mongoose';
import Category from './Category';
import User from './User';

const ResultSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return user !== null;
      },
      message: 'Данный пользователь не существует!',
    },
  },
  correct: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuizSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const category = await Category.findById(value);
        return category !== null;
      },
      message: 'Данная категория не существует!',
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return user !== null;
      },
      message: 'Данный пользователь не существует!',
    },
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  picture: String,
  rating: {
    type: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          validate: {
            validator: async (value: Types.ObjectId) => {
              const user = await User.findById(value);
              return user !== null;
            },
            message: 'Данный пользователь не существует!',
          },
        },
        ratingValue: {
          type: Number,
          required: true,
          default: null,
        },
      },
    ],
    default: [],
  },
  result: {
    type: [ResultSchema],
    default: [],
  },
});

const Quiz = model('Quiz', QuizSchema);

export default Quiz;
