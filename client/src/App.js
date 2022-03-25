import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './screens/Login';
import Register from './screens/Register';
import SessionList from './screens/SessionList';
import CreateSession from './screens/CreateSession';
import UserList from './screens/UserList';
import User from './screens/User';
import { useAppInfo } from './AppContext';

function App() {
  const { appInfo, setAppInfo } = useAppInfo();

  useEffect(() => {
    async function checkUser() {
      const { accounts, contract } = appInfo;
      if (contract) {
        const role = parseInt(
          await contract.methods.checkRole().call({ from: accounts[0] })
        );
        setAppInfo((prev) => {
          return {
            ...prev,
            role,
          };
        });
      }
    };

    checkUser();
  }, [appInfo.contract]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/sessions/create" element={<CreateSession />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:userId" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
