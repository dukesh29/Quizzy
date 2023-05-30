import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './features/users/LoginForm';
import RegisterForm from './features/users/RegisterForm';
import Protected from './components/Protected';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import Home from './features/Home';
import Layout from './components/Layout/Layout';
import { ToastContainer } from 'react-toastify';

function App() {
  const user = useAppSelector(selectUser);
  return (
    <>
      <ToastContainer />
      <Layout>
        <Routes>
          <Route element={<Protected userRole={user?.role} priority="user" />}></Route>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={'Not found'} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
