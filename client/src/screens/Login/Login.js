import React, { useEffect } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { useAppInfo } from '../../AppContext';

function Login(props) {
  const navigate = useNavigate();
  const { appInfo, setAppInfo } = useAppInfo();

  const handleClick = async () => {
    const { accounts, contract } = appInfo;
    if (contract) {
      const role = await contract.methods.checkRole().call({ from: accounts[0]});
      setAppInfo((prev) => {
        return {
          ...prev,
          role,
        };
      });
      console.log('role', role)
      if (+role === 0) {
        // case unregister
        navigate('/register');
      } else {
        navigate('/sessions');
      }
    }
  };

  return (
    <div className="login">
      <button onClick={handleClick} className="login__btn">
        Login with Meta mask
      </button>
    </div>
  );
}

export default Login;
