import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCategoriesList } from '../categories/categorySlice';
import { fetchCategories } from '../categories/categoryThunk';
import FileInput from '../../components/FileInput/FileInput';
import { QuestionDataMutation, QuizDataMutation } from '../../types';
import { selectUser } from '../users/usersSlice';
import { createQuiz } from './quizThunk';
import DeleteIcon from '@mui/icons-material/Delete';
import './Quiz.scss';
import { selectCreateQuizLoading } from './quizSlice';
import { questionTypes } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

const QuizForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const createLoading = useAppSelector(selectCreateQuizLoading);
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState('');
  const [state, setState] = useState<QuizDataMutation>({
    category: '',
    title: '',
    author: user && user._id,
    picture: null,
  });

  const [questions, setQuestions] = useState<QuestionDataMutation[]>([]);

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

  const handleAddQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value;
    setQuestionType(type);
    if (type === 'Правда или ложь') {
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          text: '',
          options: [
            { variant: 'Правда', isCorrect: false },
            { variant: 'Ложь', isCorrect: false },
          ],
        },
      ]);
    } else {
      setQuestions((prevQuestions) => [
        ...prevQuestions,
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
    }
    setQuestionType('');
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prevState) => prevState.filter((item, i) => i !== index));
  };

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (window.confirm('Вы действительно хотите создать новый квиз?')) {
        await dispatch(createQuiz({ quiz: state, questions: questions })).unwrap();
        enqueueSnackbar('Вы успешно создали Quiz! ', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        navigate('/');
      }
    } catch (e) {
      enqueueSnackbar('Что то пошло не так! ', {
        variant: 'error',
        autoHideDuration: 3000,
      });
      console.error(e);
    }
  };

  return (
    <div className="quiz_main">
      <h2 className="quizzes__title">Создание квиза</h2>
      <Grid
        sx={{ mt: 3 }}
        component="form"
        onSubmit={submitFormHandler}
        container
        direction="column"
        spacing={2}
      >
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

                <Tooltip
                  title="Удалить данный вопрос"
                  TransitionComponent={Zoom}
                  placement="top-end"
                >
                  <Button
                    variant="outlined"
                    sx={{ color: '#776BCC', border: '1px solid #776BCC' }}
                    onClick={() => handleDeleteQuestion(questionIndex)}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
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
          <Grid item xs sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              color="secondary"
              select
              fullWidth
              label="Добавить вопрос"
              name="questionType"
              value={questionType}
              onChange={handleAddQuestion}
            >
              <MenuItem value="" disabled>
                Выберите тип вопроса
              </MenuItem>
              {questionTypes.map((item) => (
                <MenuItem key={item.type} value={item.type}>
                  {item.type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <div className="button-group">
            <Grid item>
              <Button
                disabled={createLoading}
                sx={{ color: '#776BCC', border: '1px solid #776BCC' }}
                variant="outlined"
                type="submit"
              >
                {createLoading ? (
                  <CircularProgress color="secondary" size="small" />
                ) : (
                  'Создать квиз'
                )}
              </Button>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default QuizForm;
