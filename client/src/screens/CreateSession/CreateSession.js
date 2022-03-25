import React from 'react';
import Layout from '../../components/Layout';
import './CreateSession.scss';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppInfo } from '../../AppContext';
import { toast } from 'react-toastify';

function CreateSession(props) {
  const navigate = useNavigate();
  const { appInfo } = useAppInfo();
  const { register, handleSubmit, control } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'images',
  });

  const onSubmit = async (data) => {
    const { accounts, contract } = appInfo;
    const { name, description, images, timeout } = data;
    await contract.methods
      .initSession(name, description, images, timeout)
      .send({ from: accounts[0] });
    toast.success('Crease session successfully');
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
      <div className="create-session container">
        <button className="btn btn-secondary mb-3" onClick={backToList}>
          Back to list
        </button>
        <h1>Create session</h1>

        <div className="row">
          <div className="col-6">
            <form
              className="create-session__form form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form__block mb-3">
                <label htmlFor="name" className="form__text form-label">
                  Name:
                </label>
                <input
                  className="form__input form-control"
                  {...register('name')}
                />
              </div>
              <div className="form__block mb-3">
                <label htmlFor="description" className="form__text form-label">
                  Description:
                </label>
                <textarea
                  className="form__input form-control"
                  {...register('description')}
                />
              </div>
              <div className="form__block mb-3">
                <label className="form__text form-label">Images:</label>
                <button
                  className="btn btn-light"
                  onClick={addImages}
                  type="button"
                >
                  +
                </button>
                {fields.map((field, index) => (
                  <div key={field.id} className="mt-2">
                    <input
                      className="form-control"
                      key={field.id}
                      {...register(`images.${index}`)}
                    />
                  </div>
                ))}
              </div>
              <div className="form__block">
                <label className="form__text form-label">Timeout:</label>
                <input
                  className="form__input form-control"
                  type="number"
                  {...register('timeout')}
                />
              </div>
              <button className="btn btn-primary mt-3" type="submit">
                Create session
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateSession;
