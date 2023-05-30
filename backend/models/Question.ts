import { model, Schema, Types } from 'mongoose';
import Quiz from './Quiz';

const QuestionSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const quiz = await Quiz.findById(value);
        return quiz !== null;
      },
      message: 'Данный квиз не существует!',
    },
  },
  type: {
    type: String,
    enum: ['TrueFalse', 'MultipleChoice'],
  },
  text: {
    type: String,
    required: true,
  },
  image: String,
  answers: [
    {
      variant: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
        default: false,
      },
      description: String,
    },
  ],
});

const Question = model('Question', QuestionSchema);

export default Question;
