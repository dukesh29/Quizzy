import React, { useEffect, useState } from 'react';

interface Props {
  questionNumber: number;
}

const Timer: React.FC<Props> = ({ questionNumber }) => {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) setTimer(30);
    const interval = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setTimer(30);
  }, [questionNumber]);

  return <>{timer}</>;
};

export default Timer;
