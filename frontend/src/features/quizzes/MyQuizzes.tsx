import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Alert, CircularProgress, Grid, Box } from '@mui/material';
import { selectQuizzes, selectQuizzesLoading } from './quizSlice';
import { getAllQuizzes } from './quizThunk';
import QuizItem from './components/QuizItem';
import { useParams } from 'react-router-dom';
import { selectUser } from '../users/usersSlice';

const MyQuizzes = () => {
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector(selectQuizzes);
  const fetchLoading = useAppSelector(selectQuizzesLoading);
  const user = useAppSelector(selectUser);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    dispatch(getAllQuizzes(`user=${id}`));
  }, [id, dispatch]);

  return (
    quizzes && (
      <div className="quiz-block">
        <h2 className="quizzes__title">
          {id === user?._id ? 'Мои квизы' : `Квизы ${quizzes[0].author.displayName}`}
        </h2>
        {fetchLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={80} color="secondary" />
          </Box>
        ) : quizzes.length === 0 ? (
          <Alert variant="outlined" severity="info">
            Нет квизов!
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {quizzes.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <QuizItem quiz={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    )
  );
};

export default MyQuizzes;
