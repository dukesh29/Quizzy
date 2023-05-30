import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import { logout } from '../../features/users/usersThunk';
import './AppToolbar.scss';

const AppToolbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const logoutFunc = async () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      await dispatch(logout());
    }
  };

  return (
    <div className="header">
      <Link className="header__logo" to="/">
        Quizzy
      </Link>
      <nav className="navigation">
        <ul className="navigation__list">
          {user && (
            <>
              <li className="navigation__item">
                <Link to="/create_quiz" className="navigation__link">
                  Создать квиз
                </Link>
              </li>
              <li className="navigation__item">
                <Link to="/scores" className="navigation__link">
                  Результаты
                </Link>
              </li>
            </>
          )}
          <li className="navigation__item">
            <Link to="/quizzes" className="navigation__link">
              Все квизы
            </Link>
          </li>
          <li className="navigation__item">
            <Link to="/about" className="navigation__link">
              О создателе
            </Link>
          </li>
          <li className="navigation__item">
            <Link to="/contact" className="navigation__link">
              Контакты
            </Link>
          </li>
          {user ? (
            <>
              <li className="navigation__greeting">Привет {user.displayName}!</li>
              <button className="navigation__logout-item" onClick={logoutFunc}>
                Выйти
              </button>
            </>
          ) : (
            <li className="navigation__item">
              <Link to="/login" className="navigation__link">
                Войти
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default AppToolbar;
