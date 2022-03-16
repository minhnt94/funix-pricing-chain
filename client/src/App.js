import React, { useState, useEffect, useRef, useContext } from 'react';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import MainContract from './contracts/Main.json';
import getWeb3 from './getWeb3';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.scss';
// import SessionsScreen from './screens/SessionsScreen/SessionsScreen';
import Session from './screens/Session';
import Login from './screens/Login';
import Register from './screens/Register';
import SessionList from './screens/SessionList';
import UserList from './screens/UserList';
import User from './screens/User';
import AppContextProvider, { useContract, AppContext } from './AppContext';

function App() {
  const [storageValue, setStorageValue] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  // const { contractInfo, setContractInfo } = useContract();

  const { contractInfo, setContractInfo } = useContext(AppContext);

  useEffect(() => {
    console.log('contractInfo', contractInfo);
  }, [contractInfo, setContractInfo]);

  const inputRef = useRef(null);

  // useEffect(() => {
  //   async function init() {
  //     const { accounts, contract } = contractInfo;
  //     // setWeb3(web3);
  //     // setAccounts(accounts);
  //     // setContract(instance);

  //     await contract.methods.set(5).send({ from: accounts[0] });

  //     const response = await contract.methods.get().call();

  //     // Update state with the result.
  //     setStorageValue(response);
  //   };

  //   init();
  // }, [contractInfo.accounts]);

  const handleClick = async (e) => {
    await contract.methods
      .set(+inputRef.current.value)
      .send({ from: accounts[0] });

    const response = await contract.methods.get().call();

    // Update state with the result.
    setStorageValue(response);
  };

  // if (!web3) return <div>Loading Web3, accounts, and contract...</div>;

  return (
    <AppContextProvider>
      <h1>{storageValue}</h1>
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
      {accounts}
    </AppContextProvider>
  );
}

export default App;
