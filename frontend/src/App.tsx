import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './features/users/LoginForm';
import RegisterForm from './features/users/RegisterForm';
import Protected from './components/Protected';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import Layout from './components/Layout/Layout';
import CreateCategory from './features/categories/createCategory';
import QuizForm from './features/quizzes/QuizForm';
import { SnackbarProvider } from 'notistack';
import MyQuizzes from './features/quizzes/MyQuizzes';
import Home from './features/Home';
import GameView from './features/quizzes/GameView';
import MyResults from './features/quizzes/MyResults';

function App() {
  const user = useAppSelector(selectUser);
  return (
    <>
      <SnackbarProvider>
        <Layout>
          <Routes>
            <Route element={<Protected user={user} />}>
              <Route path="/create_category" element={<CreateCategory />} />
              <Route path="/create_quiz" element={<QuizForm />} />
              <Route path="/myquizresults/:id" element={<MyResults />} />
            </Route>
            <Route path="/myquizzes/:id" element={<MyQuizzes />} />
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:id" element={<GameView />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={'Not found'} />
          </Routes>
        </Layout>
      </SnackbarProvider>
    </>
  );
}

export default App;
