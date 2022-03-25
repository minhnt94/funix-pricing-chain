import React, { useEffect } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { useAppInfo } from '../../AppContext';
import { ROLE } from '../../constants';

function Login() {
  const navigate = useNavigate();
  const { appInfo, setAppInfo } = useAppInfo();

  const handleClick = async () => {
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

      if (role === ROLE.UNREGISTER) {
        // case unregister
        navigate('/register');
      } else {
        navigate('/sessions');
      }
    }
  };

  useEffect(() => {
    async function checkAdmin() {
      const { accounts, contract } = appInfo;
      const role = parseInt(
        await contract.methods.checkRole().call({ from: accounts[0] })
      );
  
      if (role === ROLE.ADMIN) {
        navigate('/sessions');
      }
    }

    checkAdmin()
  }, [appInfo]);

  return (
    <div className="login">
      <div className="login__btn-wrapper">
        <button onClick={handleClick} className="login__btn btn btn-primary">
          Login with Meta mask
        </button>
      </div>
    </div>
  );
}

export default Login;
