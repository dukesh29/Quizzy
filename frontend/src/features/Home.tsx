import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectQuizzes, selectQuizzesLoading } from './quizzes/quizSlice';
import { getAllQuizzes } from './quizzes/quizThunk';
import { Alert, Box, CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import QuizItem from './quizzes/components/QuizItem';
import { selectCategoriesList } from './categories/categorySlice';
import { fetchCategories } from './categories/categoryThunk';

const Home = () => {
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector(selectQuizzes);
  const fetchLoading = useAppSelector(selectQuizzesLoading);
  const categories = useAppSelector(selectCategoriesList);
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getAllQuizzes());
  }, [dispatch]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categoryValue = event.target.value;
    setCategoryId(categoryValue);
    await dispatch(getAllQuizzes(`category=${categoryValue}`));
  };

  return (
    quizzes && (
      <div className="allQuizzes-block">
        <h2 className="quizzes__title">Все квизы</h2>
        <Grid>
          <TextField
            color="secondary"
            select
            label="Категория"
            name="category"
            value={categoryId}
            onChange={handleChange}
            sx={{ mb: 2, minWidth: '200px' }}
            required
          >
            <MenuItem value="" disabled>
              Выберите категорию
            </MenuItem>
            <MenuItem value="">Все</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
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

export default Home;
