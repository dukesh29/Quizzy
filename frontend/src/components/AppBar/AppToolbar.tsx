import React from 'react';
import { Link } from 'react-router-dom';
import './AppToolbar.scss';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

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
            <li className="navigation__item">
              <Link to="/logout" className="navigation__link">
                Привет {user.displayName}!
              </Link>
            </li>
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
