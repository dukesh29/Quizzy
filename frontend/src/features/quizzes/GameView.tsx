import React, { useEffect, useState } from 'react';
import QuizQuestion from './components/QuizQuestion';
import Timer from './components/Timer';
import { noApiURL } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOneQuizData, selectOneQuizLoading, selectResult, unsetResult } from './quizSlice';
import { getOneQuiz, updateQuizResult } from './quizThunk';
import { useParams } from 'react-router-dom';
import { CircularProgress, Button } from '@mui/material';
import { selectUser } from '../users/usersSlice';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';

const GameView = () => {
  const dispatch = useAppDispatch();
  const [questionNumber, setQuestionNumber] = useState(1);
  const { id } = useParams() as { id: string };

  const loading = useAppSelector(selectOneQuizLoading);
  const oneQuiz = useAppSelector(selectOneQuizData);
  const result = useAppSelector(selectResult);
  const user = useAppSelector(selectUser);
  const [resultInPercent, setResultInPercent] = useState(0);
  const [isQuizResultUpdated, setIsQuizResultUpdated] = useState(false);

  useEffect(() => {
    if (user && oneQuiz && oneQuiz.questions.length < questionNumber && !isQuizResultUpdated) {
      const newResultInPercent = Math.round((result / oneQuiz.questions.length) * 100);
      setResultInPercent(newResultInPercent);
      dispatch(updateQuizResult({ user: user._id, id, correct: newResultInPercent }));
      setIsQuizResultUpdated(true);
    }
    if (!user && oneQuiz && oneQuiz.questions.length < questionNumber) {
      const newResultInPercent = Math.round((result / oneQuiz.questions.length) * 100);
      setResultInPercent(newResultInPercent);
    }
  }, [dispatch, id, oneQuiz, questionNumber, result, user, isQuizResultUpdated]);

  useEffect(() => {
    dispatch(getOneQuiz(id));
  }, [dispatch, id]);

  const restartGame = () => {
    dispatch(unsetResult());
    setQuestionNumber(1);
    setResultInPercent(0);
    setIsQuizResultUpdated(false);
  };

  let message;

  if (resultInPercent < 40) {
    message = 'Ой-ой! Это было не просто. Попробуйте ещё раз и поразите всех своими знаниями!';
  } else if (resultInPercent >= 40 && resultInPercent < 60) {
    message =
      'Не плохо, но мы знаем, что у вас есть больше потенциала! Соберите свои силы и докажите свою экспертность!';
  } else if (resultInPercent >= 60 && resultInPercent < 80) {
    message =
      'Вы точно знаете свои вещи! Но давайте поднажмем и покажем всем, насколько вы действительно круты!';
  } else if (resultInPercent >= 80 && resultInPercent < 90) {
    message =
      'Потрясающая работа! Вы просто взрываете шкалу знаний! Продолжайте и добейтесь невероятных высот!';
  } else if (resultInPercent >= 90 && resultInPercent < 100) {
    message = 'Вот это да! Вы настоящий гуру в этой области! Ваши знания сияют ярче звезд!';
  } else if (resultInPercent === 100) {
    message = 'Удивительно! Вы просто воплощение мудрости и интеллекта! Мы просто поклоняемся вам!';
  }

  return (
    oneQuiz && (
      <div className="main-block">
        {oneQuiz.questions.length < questionNumber ? (
          <div className="result-block">
            <h2 className="result-review">{message}</h2>
            <h1 className="result-title">Ваш результат: {resultInPercent} %</h1>
            <Button
              sx={{ color: '#776BCC', border: '1px solid #776BCC', mx: 'auto' }}
              variant="outlined"
              onClick={restartGame}
            >
              Начать заново
            </Button>
            {user && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Пользователь</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Результат
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Когда пройдено
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {oneQuiz.quiz.result.map((row) => (
                      <TableRow
                        key={row.createdAt?.toString()}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.user.displayName}
                        </TableCell>
                        <TableCell align="right">{row.correct} %</TableCell>
                        <TableCell align="right">
                          {dayjs(row.createdAt).format('YYYY-MM-DD HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        ) : (
          <>
            <div className="top">
              <h2 className="oneQuiz-title">{oneQuiz.quiz.title}</h2>
              <img className="quiz_image" src={noApiURL + '/' + oneQuiz.quiz.picture} alt="quiz" />
              <div className="timer">
                <Timer setQuestionNumber={setQuestionNumber} questionNumber={questionNumber} />
              </div>
              <div className="question_number">
                {questionNumber + '/' + oneQuiz.questions.length}
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
          </>
        )}
      </div>
    )
  );
};

export default GameView;
