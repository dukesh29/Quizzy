import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import { logout } from '../../features/users/usersThunk';
import Hamburger from '../Hamburger/Hamburger';
import { Avatar } from '@mui/material';
import { noApiURL } from '../../constants';
import './AppToolbar.scss';
import ModalBody from '../ModalBody';
import UserFormToEdit from '../../features/users/components/UserFormToEdit';

const AppToolbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleHamburger = () => {
    setIsOpen(!isOpen);
  };

  const closeHamburger = () => {
    setIsOpen(false);
  };

  const openDialog = () => {
    setModalOpen(true);
    closeHamburger();
  };

  const logoutFunc = async () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      await dispatch(logout());
      setIsOpen(false);
      navigate('/');
    }
  };

  return (
    <div className="header">
      <Link className="header__logo" to="/">
        Quizzy
      </Link>
      <nav className="navigation">
        <ul className={`navigation__list ${!isOpen ? 'open' : ''}`}>
          <div className="navigation__menu">
            {user && (
              <>
                <li className="navigation__item">
                  <Link to="/create_category" className="navigation__link" onClick={closeHamburger}>
                    Создать категорию
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link to="/create_quiz" className="navigation__link" onClick={closeHamburger}>
                    Создать квиз
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link
                    to={`/myquizresults/${user?._id}`}
                    className="navigation__link"
                    onClick={closeHamburger}
                  >
                    Мои результаты
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link
                    to={`/myquizzes/${user?._id}`}
                    className="navigation__link"
                    onClick={closeHamburger}
                  >
                    Мои квизы
                  </Link>
                </li>
              </>
            )}
          </div>
          {user ? (
            <div className="reverse">
              <li className="navigation__greeting" onClick={openDialog}>
                {user.avatar && (
                  <Avatar
                    alt={user.displayName}
                    src={user.avatar.startsWith('http') ? user.avatar : noApiURL + user.avatar}
                  />
                )}
                Привет {user.displayName}!
              </li>
              <button className="navigation__logout-item" onClick={logoutFunc}>
                Выйти
              </button>
            </div>
          ) : (
            <li className="navigation__item">
              <Link to="/login" className="navigation__link" onClick={closeHamburger}>
                Войти
              </Link>
            </li>
          )}
        </ul>
        <div className="hamburger" onClick={toggleHamburger}>
          <Hamburger isOpen={isOpen} />
        </div>
      </nav>
      {user && (
        <ModalBody isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <UserFormToEdit setModal={() => setModalOpen(false)} id={user._id} />
        </ModalBody>
      )}
    </div>
  );
};

export default AppToolbar;
