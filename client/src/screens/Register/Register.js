import React from 'react';
import './Register.scss';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppInfo } from '../../AppContext';

function Register(props) {
  const navigate = useNavigate();
  const { appInfo, setAppInfo } = useAppInfo();
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ email, name }) => {
    const { accounts, contract } = appInfo;
    await contract.methods.register(email, name).send({ from: accounts[0] });
    setAppInfo((prev) => {
      return {
        ...prev,
        role: 2, // participant
      };
    });

    navigate('/sessions');
  };

  return (
    <div className="register">
      <form className="register__form form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__block">
          <label className="form__text">Email</label>
          <input className="form__input" {...register('email')} />
        </div>
        <div className="form__block">
          <label className="form__text">Fullname</label>
          <input className="form__input" {...register('name')} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
