import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './features/users/LoginForm';
import RegisterForm from './features/users/RegisterForm';
import { ToastContainer } from 'react-toastify';
import './App.scss';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={'Not found'} />
      </Routes>
    </>
  );
}

export default App;
