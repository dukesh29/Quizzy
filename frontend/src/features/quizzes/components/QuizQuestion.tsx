import React, { useEffect, useState } from 'react';
import { Option, QuestionDataExample } from '../../../types';

interface Props {
  data: QuestionDataExample[];
  questionNumber: number;
  setQuestionNumber: (id: number) => void;
}

const QuizQuestion: React.FC<Props> = ({ data, setQuestionNumber, questionNumber }) => {
  const [question, setQuestion] = useState<QuestionDataExample | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Option | null>(null);
  const [className, setClassName] = useState('');

  useEffect(() => {
    setQuestion(data[questionNumber - 1]);
  }, [data, questionNumber]);

  const delay = (duration: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  const handleClick = async (a: Option) => {
    setSelectedAnswer(a);
    setClassName(a.isCorrect ? 'correct' : 'wrong');
    await delay(200);
    setQuestionNumber(questionNumber + 1);
    setSelectedAnswer(null);
  };

  return (
    question && (
      <div className="question-block">
        <div className="question-block__text">{question?.text}</div>
        <div className="question-block__answers">
          {question.options.map((item) => (
            <div
              className={selectedAnswer === item ? className : 'answer'}
              key={item.variant}
              onClick={() => handleClick(item)}
            >
              {item.variant}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default QuizQuestion;
