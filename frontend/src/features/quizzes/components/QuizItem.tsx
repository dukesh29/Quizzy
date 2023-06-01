import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import { QuizData } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { apiURL, noApiURL } from '../../../constants';
import { selectUser } from '../../users/usersSlice';
import dayjs from 'dayjs';
import { deleteQuiz, getAllQuizzes } from '../quizThunk';
import { selectDeleteQuizLoading } from '../quizSlice';
import { enqueueSnackbar } from 'notistack';

interface QuizCardProps {
  quiz: QuizData;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const deleteLoading = useAppSelector(selectDeleteQuizLoading);
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить свой квиз?')) {
      await dispatch(deleteQuiz(id));
      enqueueSnackbar('Квиз успешно удален! ', { variant: 'success', autoHideDuration: 3000 });
      await dispatch(getAllQuizzes());
    }
  };

  const startQuiz = async (id: string) => {
    navigate('/quiz/' + id);
  };

  console.log(noApiURL + '/' + quiz.picture);

  return (
    <>
      <Card sx={{ pb: 1, height: '100%' }}>
        <CardMedia
          component="img"
          height="250px"
          image={noApiURL + '/' + quiz.picture}
          alt={quiz.title}
          sx={{
            '&:hover': {
              opacity: 0.8,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease-in-out',
            },
          }}
        />
        <Typography component="p" sx={{ fontSize: '12px', p: 1, m: 0, textAlign: 'right' }}>
          Создан: {dayjs(quiz.createdAt).format('YYYY-MM-DD HH:mm')}
        </Typography>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            py: 0,
          }}
        >
          <Typography />
          <Typography sx={{ mb: 2 }} component="h3" variant="h5">
            {quiz.title}
          </Typography>
          <Link
            component={RouterLink}
            to={`/quiz/${quiz.author}`}
            sx={{
              color: 'black',
              mb: 2,
              fontWeight: 'bold',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
              },
            }}
          >
            Author: {quiz.author}
          </Link>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="secondary"
            variant="outlined"
            onClick={() => startQuiz(quiz.author)}
            sx={{ mx: 'auto' }}
          >
            {deleteLoading ? <CircularProgress /> : 'Начать квиз'}
          </Button>
          {user && (user._id === quiz.author || user.role === 'admin') && (
            <Button
              size="small"
              color="secondary"
              variant="outlined"
              onClick={() => handleDelete(quiz._id)}
              disabled={deleteLoading}
              sx={{ mx: 'auto' }}
            >
              {deleteLoading ? <CircularProgress color="secondary" size="small" /> : 'Удалить'}
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default QuizCard;
