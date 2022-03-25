import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import { useAppInfo } from '../../AppContext';
import { ROLE } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useCheckUser } from '../../hooks/useCheckUser';
import './UserList.scss';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

function UserList(props) {
  const [participants, setParticipants] = useState([]);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [triggerReload, setTriggerReload] = useState(false);
  const { appInfo } = useAppInfo();
  const navigate = useNavigate();
  useCheckUser();
  const { register, handleSubmit, setValue } = useForm();

  const { accounts, contract } = appInfo;
  const isAdmin = appInfo.role === ROLE.ADMIN;
  const listMode = currentParticipant === null;

	useEffect(() => {
		if(!isAdmin) {
			navigate('/')
		}
	}, [isAdmin])

  useEffect(() => {
    async function fetchParticipants() {
      if (contract) {
        const participants = await contract.methods
          .getParticipantList()
          .call({ from: accounts[0] });

        console.log('participants', participants);
        setParticipants(participants);
      }
    }

    fetchParticipants();
  }, [appInfo, triggerReload]);

  const onSubmit = async ({ email, name }) => {
    const { accounts, contract } = appInfo;
    await contract.methods
      .updateParticipantInfo(currentParticipant.account, email, name)
      .send({ from: accounts[0] });

    handleBack();
		toast.success('Edit participant info successfully')
  };

  const handleViewDetail = (id) => {
    const participant = participants[id];
    setCurrentParticipant(participant);
    setValue('email', participant.email);
    setValue('name', participant.name);
  };

  const handleBack = () => {
    setCurrentParticipant(null);
    setTriggerReload((reload) => !reload);
  };

  return (
    <Layout>
      {listMode && (
        <div className="container participants">
          <h1 className="mb-5">Participant list</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Email</th>
                <th>Name</th>
                <th>Deviation</th>
                <th>Session count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr className="participant-info align-middle" key={index}>
                  <td>{index + 1}</td>
                  <td>{participant.email}</td>
                  <td>{participant.name}</td>
                  <td>{participant.deviation}</td>
                  <td>{participant.sessionsCount}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      type="button"
                      onClick={() => handleViewDetail(index)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!listMode && currentParticipant && (
        <div className="edit-participant container">
          <div className="row">
            <div className="col-6">
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
                  <span>{currentParticipant.deviation}</span>
                </div>
                <div className="mb-3">
                  <span className="form-label">Session count:</span>
                  <span>{currentParticipant.sessionsCount}</span>
                </div>

                <button type="submit" className="btn btn-primary">
                  Edit info
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-3"
                  onClick={handleBack}
                >
                  Back to list
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default UserList;
