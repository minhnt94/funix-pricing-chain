import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import './SessionList.scss';
import { useAppInfo } from '../../AppContext';
import { ROLE, STATUS } from '../../constants';
import { useNavigate } from 'react-router-dom';

function SessionList(props) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const proposePriceEle = useRef();
  const finalPriceEle = useRef();
  const { appInfo } = useAppInfo();
  const { accounts, contract } = appInfo;
  const isAdmin = appInfo.role === ROLE.ADMIN;
  const navigate = useNavigate();

  useEffect(() => {
    // setSessions(mockData);
    //call to get list session

    async function fetchSessions() {
      if (contract) {
        const sessions = await contract.methods
          .getSessions()
          .call({ from: accounts[0] });
        // console.log('sessions', sessions)
        setSessions(sessions);
      }
    }

    fetchSessions();
  }, [appInfo]);

  const renderImages = (images) => {
    return images.map((img, i) => (
      <img key={i} src={img} className="session-info__img" />
    ));
  };

  const handleViewDetail = (id) => {
    setCurrentSession(sessions[id]);
  };

  const handleBack = () => {
    setCurrentSession(null);
  };

  const handleSubmitProposePrice = async () => {
    const proposePrice = parseInt(proposePriceEle.current.value);
    const sessionId = currentSession.id;
    console.log(sessionId, proposePrice)

    await contract.methods
      .submitPrice(sessionId, proposePrice)
      .send({ from: accounts[0] });
  };

  const handleSubmitFinalPrice = async () => {
    const finalPrice = finalPriceEle.current.value;
    const sessionId = currentSession.id;

    await contract.methods
      .setFinalPrice(sessionId, finalPrice)
      .send({ from: accounts[0] });
  };

  const handleCloseSession = async () => {
    const sessionId = currentSession.id;
    await contract.methods.closeSession(sessionId).send({ from: accounts[0] });
    handleBack();
  };

  const getStatusText = (status) => {
    switch (status) {
      case STATUS.ON_GOING:
        return 'On Going';
      case STATUS.CLOSED:
        return 'Closed';
      default:
        return 'On Going';
    }
  };

  return (
    <Layout>
      {!Boolean(currentSession) && (
        <div className="sessions">
          <h1 className="sessions__title">Session list page here</h1>
          {isAdmin && (
            <button onClick={() => navigate('create')}>Add new session</button>
          )}
          <table className="sessions__table">
            <thead>
              <tr>
                <th>No</th>
                <th>Images</th>
                <th>Name</th>
                <th>Status</th>
                <th>Description</th>
                {/* <th>Propose Price</th> */}
                <th>Final price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr className="session-info" key={index}>
                  <td>{index + 1}</td>
                  <td>{renderImages(session.images)}</td>
                  <td>{session.name}</td>
                  <td>{getStatusText(session.state)}</td>
                  <td>{session.description}</td>
                  {/* <td>{session.proposePrice}</td> */}
                  <td>
                    {session.state === STATUS.CLOSED && session.finalPrice}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleViewDetail(index)}
                    >
                      View detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {Boolean(currentSession) && (
        <div className="session">
          <button onClick={handleBack}>Back to list</button>
          <h1 className="session__title">Session detail:</h1>
          <div className="info">
            <div className="info__name">
              Name: <span>{currentSession.name}</span>
            </div>
            <div className="info__images">
              {currentSession.images.map((img, index) => (
                <img key={index} src={img} className="info__image" />
              ))}
            </div>
            <div className="info__description">
              Description: <span>{currentSession.description}</span>
            </div>
            <div className="info__state">
              Status: <span>{getStatusText(currentSession.state)}</span>
            </div>
            {currentSession.state == STATUS.ON_GOING && !isAdmin && (
              <div className="info__propose-price">
                <label>Propose price:</label>
                <input ref={proposePriceEle} />
                <button onClick={handleSubmitProposePrice}>
                  Submit propose price
                </button>
              </div>
            )}

            {currentSession.state == STATUS.CLOSED && isAdmin && (
              <div className="info__final-price">
                <label>Final price:</label>
                <input value={currentSession.finalPrice} ref={finalPriceEle} />
                <button onClick={handleSubmitFinalPrice}>
                  Set final price
                </button>
              </div>
            )}
            {currentSession.state == STATUS.ON_GOING && isAdmin && (
              <button onClick={handleCloseSession}>Close session</button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default SessionList;
