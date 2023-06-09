import React, { useEffect, useState } from 'react';
import { Option, QuestionDataExample } from '../../../types';
import { useAppDispatch } from '../../../app/hooks';
import { addResult } from '../quizSlice';

interface Props {
  data: QuestionDataExample[];
  questionNumber: number;
  setQuestionNumber: (id: number) => void;
}

const QuizQuestion: React.FC<Props> = ({ data, setQuestionNumber, questionNumber }) => {
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState<QuestionDataExample | null>(null);

  useEffect(() => {
    setQuestion(data[questionNumber - 1]);
  }, [data, questionNumber]);

  const handleClick = async (a: Option) => {
    a.isCorrect && dispatch(addResult());
    setQuestionNumber(questionNumber + 1);
  };

  return (
    question && (
      <div className="question-block">
        <div className="question-block__text">{question?.text}</div>
        <div className="question-block__answers">
          {question.options.map((item) => (
            <div className="answer" key={item.variant} onClick={() => handleClick(item)}>
              {item.variant}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default QuizQuestion;
