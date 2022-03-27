import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import './SessionList.scss';
import { useAppInfo } from '../../AppContext';
import { ROLE, STATUS } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useCheckUser } from '../../hooks/useCheckUser';
import clsx from 'clsx';
import { toast } from 'react-toastify';

function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [triggerReload, setTriggerReload] = useState(false);
  const proposePriceEle = useRef();
  const finalPriceEle = useRef();
  const { appInfo } = useAppInfo();
  const { accounts, contract } = appInfo;
  const isAdmin = appInfo.role === ROLE.ADMIN;
  const navigate = useNavigate();
  useCheckUser();

  useEffect(() => {
    async function fetchSessions() {
      if (contract) {
        const sessions = await contract.methods
          .getSessions()
          .call({ from: accounts[0] });
        setSessions(sessions);
      }
    }

    fetchSessions();
  }, [appInfo, triggerReload]);

  const renderImages = (images) => {
    return images.map((img, i) => (
      <img key={i} src={img} className="session-info__img" alt="sesion-img" />
    ));
  };

  const handleViewDetail = (id) => {
    setCurrentSession(sessions[id]);
  };

  const handleBack = () => {
    setCurrentSession(null);
    setTriggerReload((reload) => !reload);
  };

  const handleSubmitProposePrice = async () => {
    const proposePrice = parseInt(proposePriceEle.current.value);
    const sessionId = currentSession.id;

    await contract.methods
      .submitPrice(sessionId, proposePrice)
      .send({ from: accounts[0] });
    handleBack();
    toast.success('Submit propose price successfully');
  };

  const handleSubmitFinalPrice = async () => {
    const finalPrice = +finalPriceEle.current.value;
    const sessionId = +currentSession.id;

    await contract.methods
      .setFinalPrice(sessionId, finalPrice)
      .send({ from: accounts[0] });

    toast.success('Submit final price successfully');
    handleBack();
  };

  const handleCloseSession = async () => {
    const sessionId = currentSession.id;
    await contract.methods.closeSession(sessionId).send({ from: accounts[0] });
    toast.success('Close session successfully');
    handleBack();
  };

  const getStatusText = (status) => {
    switch (+status) {
      case STATUS.ON_GOING:
        return 'On Going';
      case STATUS.CLOSED:
        return 'Closed';
      default:
        return 'On Going';
    }
  };

  const getCurrentProposePrice = () => {
    const proposeList = currentSession?.proposeList;
    const currentPropose = proposeList.find(
      (propose) => propose.participantAddress === accounts[0]
    );

    return currentPropose;
  };

  return (
    <Layout>
      {!Boolean(currentSession) && (
        <div className="sessions container">
          <h1 className="mb-5">Session list</h1>
          {isAdmin && (
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-primary"
                onClick={() => navigate('create')}
              >
                Add new session
              </button>
            </div>
          )}
          <table className="table table-hover">
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
                <tr className="session-info align-middle" key={index}>
                  <td>{index + 1}</td>
                  <td>{renderImages(session.images)}</td>
                  <td>{session.name}</td>
                  <td>
                    <span
                      className={clsx({
                        badge: true,
                        'bg-danger': +session.state === STATUS.CLOSED,
                        'bg-success': +session.state !== STATUS.CLOSED,
                      })}
                    >
                      {getStatusText(session.state)}
                    </span>
                  </td>
                  <td>{session.description}</td>
                  {/* <td>{session.proposePrice}</td> */}
                  <td>
                    {+session.state === STATUS.CLOSED && session.finalPrice}
                  </td>
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
      {Boolean(currentSession) && (
        <div className="session container">
          <button className="btn btn-secondary mb-4" onClick={handleBack}>
            Back to list
          </button>

          <h1 className="session__title">Session detail:</h1>

          <div className="row">
            <div className="col-5">
              <div className="info__images">
                {currentSession.images.map((img, index) => (
                  <img key={index} src={img} className="info__image" />
                ))}
              </div>
            </div>
            <div className="col-7">
              <div className="info">
                <div className="info__name">
                  <span className="fs-5 fw-bold">Name:</span>{' '}
                  <span>{currentSession.name}</span>
                </div>

                <div className="info__description">
                  <span className="fs-5 fw-bold">Description:</span>
                  <span>{currentSession.description}</span>
                </div>
                <div className="info__count">
                  <span className="fs-5 fw-bold">Participant count:</span>
                  <span>{currentSession.proposeList.length}</span>
                </div>
                <div className="info__state align-middle d-flex align-items-center">
                  <span className="fs-5 fw-bold">Status:</span>{' '}
                  <span
                    className={clsx({
                      badge: true,
                      'bg-danger': +currentSession.state === STATUS.CLOSED,
                      'bg-success': +currentSession.state !== STATUS.CLOSED,
                    })}
                  >
                    {getStatusText(currentSession.state)}
                  </span>
                </div>
                {Boolean(getCurrentProposePrice()?.price) && !isAdmin && (
                  <div className="info__propose-price">
                    <span className="fs-5 fw-bold">Last propose price:</span>
                    <span>{getCurrentProposePrice()?.price}</span>
                  </div>
                )}

                {+currentSession.state === STATUS.ON_GOING && !isAdmin && (
                  <>
                    <div className="info__propose-price">
                      <label className="fs-5 fw-bold">Propose price:</label>
                      <input ref={proposePriceEle} />
                      <button
                        className="btn btn-primary ms-3"
                        onClick={handleSubmitProposePrice}
                      >
                        Submit propose price
                      </button>
                    </div>
                  </>
                )}

                {+currentSession.state === STATUS.CLOSED && !isAdmin && (
                  <>
                    <div className="info__final-price">
                      {+currentSession.finalPrice > 0 && (
                        <>
                          <label className="fs-5 fw-bold">Final price:</label>
                          <span>{currentSession.finalPrice}</span>
                        </>
                      )}
                    </div>
                  </>
                )}

                {+currentSession.state === STATUS.CLOSED && isAdmin && (
                  <>
                    <div className="info__propose-price">
                      <label className="fs-5 fw-bold">Propose price:</label>
                      <span>{currentSession.proposePrice}</span>
                    </div>
                    <div className="info__final-price">
                      {+currentSession.finalPrice > 0 && (
                        <>
                          <label className="fs-5 fw-bold">Final price:</label>
                          <span>{currentSession.finalPrice}</span>
                        </>
                      )}

                      {+currentSession.finalPrice === 0 && (
                        <div className="row mt-3">
                          <div className="col-6">
                            <input
                              ref={finalPriceEle}
                              className="form-control"
                              id="finalPriceFloating"
                              placeholder="Enter final price"
                            />
                          </div>
                          <div className="col-6">
                            <button
                              className="btn btn-primary"
                              onClick={handleSubmitFinalPrice}
                            >
                              Set final price
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {+currentSession.state === STATUS.ON_GOING && isAdmin && (
                  <button
                    className="btn btn-warning mt-3"
                    onClick={handleCloseSession}
                  >
                    Close session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default SessionList;
