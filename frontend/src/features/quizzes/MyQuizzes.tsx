import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Alert, CircularProgress, Grid, Box } from '@mui/material';
import { selectQuizzes, selectQuizzesLoading } from './quizSlice';
import { getAllQuizzes } from './quizThunk';
import QuizItem from './components/QuizItem';
import { useParams } from 'react-router-dom';

const MyQuizzes = () => {
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector(selectQuizzes);
  const fetchLoading = useAppSelector(selectQuizzesLoading);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    dispatch(getAllQuizzes());
  }, [id, dispatch]);

  return (
    quizzes && (
      <>
        <h2 className="quizzes__title">Мои квизы</h2>
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
      </>
    )
  );
};

export default MyQuizzes;
