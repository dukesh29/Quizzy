import React, { PropsWithChildren, ReactNode } from 'react';
import AppToolbar from '../AppBar/AppToolbar';
import Footer from '../Footer/Footer';

interface Props extends PropsWithChildren {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <AppToolbar />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
