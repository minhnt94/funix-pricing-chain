import React, { useEffect } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../../AppContext'

function Login(props) {
  const navigate = useNavigate();
  const value = useContract();

  useEffect(() => {
    // check if user already connect to metamask
    // then check current account existed or not
    // then redirect to register page
    // or redirect to session
    // if(isRegistered) {
    //   navigate('/sessionList')
    // } else {
    //   navigate('/register')
    // }

    console.log('value in login', value)
  }, [value]);

  const handleClick = () => {
    // TODO: connect meta mask
    // then redirect to register page
    // or redirect to session list
    const isRegistered = false;
    
    if(isRegistered) {
      navigate('/sessions')
    } else {
      navigate('/register')
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
