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

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="register container">
      <h1>Register</h1>
      <div className="row">
        <div className="col-6">
          <form
            className="register__form form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input className="form-control" {...register('email')} />
            </div>
            <div className="form__block">
              <label htmlFor="name" className="form-label">
                Fullname
              </label>
              <input className="form-control" {...register('name')} />
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-3"
                onClick={handleBack}
              >
                Back to login page
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
