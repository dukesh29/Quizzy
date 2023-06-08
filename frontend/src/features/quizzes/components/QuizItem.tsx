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
  Box,
} from '@mui/material';
import { QuizData } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { noApiURL } from '../../../constants';
import { selectUser } from '../../users/usersSlice';
import dayjs from 'dayjs';
import { deleteQuiz, getAllQuizzes } from '../quizThunk';
import { selectDeleteQuizLoading } from '../quizSlice';
import { enqueueSnackbar } from 'notistack';
import RatingCard from './RatingCard';

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

  return (
    <>
      <Card
        sx={{
          pb: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardMedia
          component="img"
          height="250px"
          image={noApiURL + quiz.picture}
          alt={quiz.title}
          sx={{
            '&:hover': {
              opacity: 0.8,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease-in-out',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
          <Typography
            component="p"
            sx={{ fontSize: '12px', p: 1, m: 0, textAlign: 'right', fontStyle: 'italic' }}
          >
            Создан: {dayjs(quiz.createdAt).format('YYYY-MM-DD HH:mm')}
          </Typography>
          <RatingCard id={quiz._id} rating={quiz.rating} />
        </Box>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            py: 0,
            marginTop: 'auto',
          }}
        >
          <Typography />
          <Typography
            sx={{ mb: 2, color: '#260d0d', fontWeight: 'bold' }}
            component="h3"
            variant="h5"
          >
            {quiz.title}
          </Typography>
          <Link
            component={RouterLink}
            to={`/myquizzes/${quiz.author._id}`}
            sx={{
              color: '#2a2070',
              mb: 2,
              fontWeight: 'bold',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
              },
            }}
          >
            Author: {quiz.author.displayName}
          </Link>
        </CardContent>
        <CardActions sx={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto' }}>
          <Button
            size="small"
            sx={{ mx: 'auto', color: '#776BCC', border: '1px solid #776BCC' }}
            variant="outlined"
            onClick={() => startQuiz(quiz._id)}
          >
            {deleteLoading ? <CircularProgress color="secondary" size="small" /> : 'Начать квиз'}
          </Button>
          {user && (user._id === quiz.author._id || user.role === 'admin') && (
            <Button
              size="small"
              sx={{ mx: 'auto', color: '#776BCC', border: '1px solid #776BCC' }}
              variant="outlined"
              onClick={() => handleDelete(quiz._id)}
              disabled={deleteLoading}
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
