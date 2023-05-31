import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import { logout } from '../../features/users/usersThunk';
import Hamburger from '../Hamburger/Hamburger';
import './AppToolbar.scss';

const AppToolbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);

  const toggleHamburger = () => {
    setIsOpen(!isOpen);
  };

  const closeHamburger = () => {
    setIsOpen(false);
  };

  const logoutFunc = async () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      await dispatch(logout());
      setIsOpen(false);
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
                {user.role === 'admin' && (
                  <li className="navigation__item">
                    <Link
                      to="/create_category"
                      className="navigation__link"
                      onClick={closeHamburger}
                    >
                      Создать категорию
                    </Link>
                  </li>
                )}
                <li className="navigation__item">
                  <Link to="/create_quiz" className="navigation__link" onClick={closeHamburger}>
                    Создать квиз
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link to="/scores" className="navigation__link" onClick={closeHamburger}>
                    Результаты
                  </Link>
                </li>
              </>
            )}
            <li className="navigation__item">
              <Link to="/quizzes" className="navigation__link" onClick={closeHamburger}>
                Все квизы
              </Link>
            </li>
          </div>
          {user ? (
            <div className="reverse">
              <li className="navigation__greeting">Привет {user.displayName}!</li>
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
    </div>
  );
};

export default AppToolbar;
