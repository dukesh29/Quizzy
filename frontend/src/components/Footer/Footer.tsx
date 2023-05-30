import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  return (
    <div className="footer">
      <p className="footer__title">Автор: Дуулат Акматбеков</p>
      <Link
        target="_blank"
        to="https://github.com/dukesh29"
        className="footer__social-connect github"
      />
      <Link
        target="_blank"
        to="https://www.linkedin.com/in/duulat-akmatbekov-8b2ab125b/"
        className="footer__social-connect linkedIn"
      />
    </div>
  );
};

export default Footer;
