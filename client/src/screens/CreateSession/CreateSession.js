import React from 'react';
import Layout from '../../components/Layout';
import './CreateSession.scss';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppInfo } from '../../AppContext';


function CreateSession(props) {
  const navigate = useNavigate();
  const { appInfo } = useAppInfo();
  const { register, handleSubmit, control } = useForm();
  const { fields, append } = useFieldArray(
    {
      control,
      name: 'images',
    }
  );

  const onSubmit = async (data) => {
    const { accounts, contract } = appInfo;
    const { name, description, images, timeout } = data;
    console.log(name, description, images, timeout);
    await contract.methods.initSession(name, description, images, timeout).send({ from: accounts[0] });
    backToList();
  };

  const backToList = () => {
    navigate('/sessions');
  };

  const addImages = () => {
    append();
  };

  return (
    <Layout>
      <div className="create-session">
        <button onClick={backToList}>Back to list</button>
        <h1>Create session</h1>
        <form
          className="create-session__form form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form__block">
            <label className="form__text">Name:</label>
            <input className="form__input" {...register('name')} />
          </div>
          <div className="form__block">
            <label className="form__text">Description:</label>
            <textarea className="form__input" {...register('description')} />
          </div>
          <div className="form__block">
            <label className="form__text">Images:</label>
            <button onClick={addImages}>+</button>
            {fields.map((field, index) => (
              <div key={field.id}>
                <input key={field.id} {...register(`images.${index}`)} />
              </div>
            ))}
          </div>
          <div className="form__block">
            <label className="form__text">Timeout:</label>
            <input
              className="form__input"
              type="number"
              {...register('timeout')}
            />
          </div>
          <button type="submit">Create session</button>
        </form>
      </div>
    </Layout>
  );
}

export default CreateSession;
