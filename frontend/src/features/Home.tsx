import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { logout } from './users/usersThunk';

const Home = () => {
  const dispatch = useAppDispatch();

  const logoutFunc = async () => {
    await dispatch(logout());
  };

  return (
    <div>
      <button onClick={logoutFunc}>Выйти</button>
    </div>
  );
};

export default Home;
