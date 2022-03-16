import React from 'react';
import './Register.scss';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

function Register(props) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
        {/* <button type='button'>Sign in</button> */}
      </form>
    </div>
  );
}

export default Register;
