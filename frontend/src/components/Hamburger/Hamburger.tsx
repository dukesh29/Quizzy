import React from 'react';
import './Hamburger.scss';

interface Props {
  isOpen: boolean;
}

const Hamburger: React.FC<Props> = ({ isOpen }) => {
  return (
    <>
      <div className="hamburger">
        <div className={`burger burger1 ${isOpen ? 'open1' : ''}`} />
        <div className={`burger burger2 ${isOpen ? 'open2' : ''}`} />
        <div className={`burger burger3 ${isOpen ? 'open3' : ''}`} />
      </div>
    </>
  );
};

export default Hamburger;
