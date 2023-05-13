import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './features/users/LoginForm';
import './App.scss';

import RegisterForm from './features/users/RegisterForm';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="*" element={'Not found'} />
    </Routes>
  );
}

export default App;
