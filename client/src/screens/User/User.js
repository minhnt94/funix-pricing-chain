import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import { useAppInfo } from '../../AppContext';
import { useNavigate } from 'react-router-dom';
import { useCheckUser } from '../../hooks/useCheckUser';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

function User(props) {
  const [participant, setParticipant] = useState(null);
  const { appInfo } = useAppInfo();
  useCheckUser();
  const { register, handleSubmit, setValue } = useForm();

  const { accounts, contract } = appInfo;

  useEffect(() => {
    async function fetchParticipantInfo() {
      if (contract) {
        const participant = await contract.methods
          .getCurrentParticipantDetail()
          .call({ from: accounts[0] });

        console.log('participant', participant);
        setParticipant(participant);
        setValue('email', participant.email);
        setValue('name', participant.name);
      }
    }

    fetchParticipantInfo();
  }, [appInfo]);

  const onSubmit = async ({ email, name }) => {
    const { accounts, contract } = appInfo;
    await contract.methods
      .updateCurrentParticipantInfo(email, name)
      .send({ from: accounts[0] });

    toast.success('Edit info successfully');
  };

  return (
    <Layout>
      <div className="container">
        <h1>Edit your profile</h1>
        <div className="row">
          <div className="col-6">
            {participant && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    {...register('email')}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    {...register('name')}
                  />
                </div>
                <div className="mb-3">
                  <span className="form-label">Deviation:</span>
                  <span>{participant.deviation}</span>
                </div>
                <div className="mb-3">
                  <span className="form-label">Session count:</span>
                  <span>{participant.sessionsCount}</span>
                </div>

                <button type="submit" className="btn btn-primary">
                  Edit info
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default User;
