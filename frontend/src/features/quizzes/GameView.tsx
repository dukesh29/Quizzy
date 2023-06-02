import React, { useEffect, useState } from 'react';
import QuizQuestion from './components/QuizQuestion';
import Timer from './components/Timer';
import { noApiURL } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOneQuizData, selectOneQuizLoading } from './quizSlice';
import { getOneQuiz } from './quizThunk';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const GameView = () => {
  const dispatch = useAppDispatch();
  const [questionNumber, setQuestionNumber] = useState(1);
  const { id } = useParams() as { id: string };

  const loading = useAppSelector(selectOneQuizLoading);
  const oneQuiz = useAppSelector(selectOneQuizData);

  useEffect(() => {
    void dispatch(getOneQuiz(id));
  }, [dispatch, id]);

  return (
    oneQuiz && (
      <div className="main-block">
        <div className="top">
          <h2 className="oneQuiz-title">{oneQuiz.quiz.title}</h2>
          <img className="quiz_image" src={noApiURL + '/' + oneQuiz.quiz.picture} alt="quiz" />
          <div className="timer">
            <Timer questionNumber={questionNumber} />
          </div>
        </div>
        <div className="bottom">
          {loading ? (
            <CircularProgress color="secondary" size="small" />
          ) : (
            <QuizQuestion
              data={oneQuiz.questions}
              questionNumber={questionNumber}
              setQuestionNumber={setQuestionNumber}
            />
          )}
        </div>
      </div>
    )
  );
};

export default GameView;
