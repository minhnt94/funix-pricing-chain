import React from 'react';
import Header from '../Header'
import './Layout.scss';

function Layout({children}) {
    return <div className='layout'>
        <Header />
        {children}
    </div>
}

export default Layout