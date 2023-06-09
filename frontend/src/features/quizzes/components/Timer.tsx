import React, { useEffect, useState } from 'react';

interface Props {
  questionNumber: number;
  setQuestionNumber: (id: number) => void;
}

const Timer: React.FC<Props> = ({ questionNumber, setQuestionNumber }) => {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) {
      setQuestionNumber(questionNumber + 1);
      setTimer(30);
    }
    const interval = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [questionNumber, setQuestionNumber, timer]);

  useEffect(() => {
    setTimer(30);
  }, [questionNumber]);

  return <>{timer}</>;
};

export default Timer;
