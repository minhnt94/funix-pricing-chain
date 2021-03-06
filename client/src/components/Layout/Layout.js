import React from 'react';
import Header from '../Header';
import './Layout.scss';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className='layout__content'>{children}</div>
    </div>
  );
}

export default Layout;
