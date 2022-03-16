import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.scss';
// import SessionsScreen from './screens/SessionsScreen/SessionsScreen';
import Session from './screens/Session';
import Login from './screens/Login';
import Register from './screens/Register';
import SessionList from './screens/SessionList';
import UserList from './screens/UserList';
import User from './screens/User';
import AppContextProvider, { useAppInfo, AppContext } from './AppContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/sessions/:sessionId" element={<Session />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:userId" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
