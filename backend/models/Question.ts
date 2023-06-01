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
  text: {
    type: String,
    required: true,
  },
  options: [
    {
      variant: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const Question = model('Question', QuestionSchema);

export default Question;
