import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCategoriesList } from '../../categories/categorySlice';
import { fetchCategories } from '../../categories/categoryThunk';
import FileInput from '../../../components/FileInput/FileInput';
import { QuestionMutation, QuizDataMutation } from '../../../types';
import { selectUser } from '../../users/usersSlice';
import '../Quiz.scss';

const QuizForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [state, setState] = useState<QuizDataMutation>({
    category: '',
    title: '',
    author: user && user._id,
    picture: null,
  });

  const [questions, setQuestions] = useState<QuestionMutation[]>([
    {
      text: '',
      image: null,
      options: [
        { variant: '', isCorrect: false },
        { variant: '', isCorrect: false },
        { variant: '', isCorrect: false },
        { variant: '', isCorrect: false },
      ],
    },
  ]);

  const categories = useAppSelector(selectCategoriesList);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].text = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const file = event.target.files && event.target.files[0];
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].image = file;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
    optionIndex: number,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].variant = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    optionIndex: number,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = event.target
      .checked as boolean;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        image: null,
        options: [
          { variant: '', isCorrect: false },
          { variant: '', isCorrect: false },
          { variant: '', isCorrect: false },
          { variant: '', isCorrect: false },
        ],
      },
    ]);
  };

  const submitFormHandler = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(state);
    console.log(questions);
  };

  return (
    <>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ my: 3 }}>
          Создание квиза
        </Typography>
      </Box>
      <Grid component="form" onSubmit={submitFormHandler} container direction="column" spacing={2}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              color="secondary"
              select
              fullWidth
              label="Категория"
              name="category"
              value={state.category}
              onChange={inputChangeHandler}
              required
            >
              <MenuItem value="" disabled>
                Выберите категорию
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              color="secondary"
              fullWidth
              id="title"
              label="Название"
              value={state.title}
              onChange={inputChangeHandler}
              name="title"
              required
            />
          </Grid>
          <Grid item xs>
            <FileInput onChange={fileInputChangeHandler} name="picture" label="Image" />
          </Grid>
          {questions.map((question, questionIndex) => (
            <React.Fragment key={questionIndex}>
              <Grid item>
                <TextField
                  color="secondary"
                  fullWidth
                  id={`text-${questionIndex}`}
                  label={`Вопрос ${questionIndex + 1}`}
                  value={question.text}
                  onChange={(event) => handleTextChange(event, questionIndex)}
                  required
                />
              </Grid>
              <Grid item>
                <FileInput
                  onChange={(event) => handleImageChange(event, questionIndex)}
                  name="picture"
                  label="Image"
                />
              </Grid>
              {question.options.map((option, optionIndex) => (
                <Grid
                  sx={{ mt: 2, ml: 1, display: 'flex', gap: '10px' }}
                  container
                  spacing={2}
                  key={optionIndex}
                >
                  <Grid item>
                    <TextField
                      color="secondary"
                      fullWidth
                      label={`Вариант ${optionIndex + 1}`}
                      value={option.variant}
                      onChange={(event) => handleOptionChange(event, questionIndex, optionIndex)}
                      required
                    />
                  </Grid>
                  <Grid item>
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={(event) =>
                        handleCorrectOptionChange(event, questionIndex, optionIndex)
                      }
                    />
                  </Grid>
                </Grid>
              ))}
            </React.Fragment>
          ))}
          <div className="button-group">
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={handleAddQuestion}>
                Добавить вопрос
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" type="submit" color="secondary">
                Создать квиз
              </Button>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default QuizForm;
