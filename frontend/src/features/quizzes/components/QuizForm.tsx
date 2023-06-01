import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCategoriesList } from '../../categories/categorySlice';
import { fetchCategories } from '../../categories/categoryThunk';
import FileInput from '../../../components/FileInput/FileInput';
import { QuestionDataMutation, QuizDataMutation } from '../../../types';
import { selectUser } from '../../users/usersSlice';
import { createQuiz } from '../quizThunk';
import '../Quiz.scss';
import DeleteIcon from '@mui/icons-material/Delete';

const QuizForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [state, setState] = useState<QuizDataMutation>({
    category: '',
    title: '',
    author: user && user._id,
    picture: null,
  });

  const [questions, setQuestions] = useState<QuestionDataMutation[]>([
    {
      text: '',
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
        options: [
          { variant: '', isCorrect: false },
          { variant: '', isCorrect: false },
          { variant: '', isCorrect: false },
          { variant: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prevState) => prevState.filter((item, i) => i !== index));
  };

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createQuiz({ quiz: state, questions: questions }));
  };

  return (
    <>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h3" variant="h3" sx={{ my: 5 }}>
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
          <Grid item xs sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" color="secondary" onClick={handleAddQuestion}>
              Добавить вопрос
            </Button>
          </Grid>
          {questions.map((question, questionIndex) => (
            <React.Fragment key={questionIndex}>
              <Typography component="h1" variant="h5" sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
                {`Вопроc ${questionIndex + 1}`}
              </Typography>
              <Grid item sx={{ display: 'flex', gap: '10px' }}>
                <TextField
                  fullWidth
                  color="secondary"
                  id={`text-${questionIndex}`}
                  label={`Вопрос ${questionIndex + 1}`}
                  value={question.text}
                  onChange={(event) => handleTextChange(event, questionIndex)}
                  required
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteQuestion(questionIndex)}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
              {question.options.map((option, optionIndex) => (
                <Grid key={optionIndex} item sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TextField
                    color="secondary"
                    fullWidth
                    label={`Вариант ${optionIndex + 1}`}
                    value={option.variant}
                    onChange={(event) => handleOptionChange(event, questionIndex, optionIndex)}
                    required
                  />
                  <Tooltip
                    title="Отметь верный вариант"
                    TransitionComponent={Zoom}
                    placement="right"
                  >
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={(event) =>
                        handleCorrectOptionChange(event, questionIndex, optionIndex)
                      }
                    />
                  </Tooltip>
                </Grid>
              ))}
            </React.Fragment>
          ))}
          <div className="button-group">
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
