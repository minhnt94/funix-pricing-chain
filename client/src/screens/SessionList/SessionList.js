import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import './SessionList.scss';

// address parentContract;
// string name;
// string description;
// string[] images;
// uint proposePrice;
// uint timeout;
// uint initTime;
// uint finalPrice;

const mockData = [
  {
    id: 0,
    images: ['https://picsum.photos/200', 'https://picsum.photos/200'],
    name: 'Old product',
    description: 'This is my very old one',
    state: 'ongoing',
    proposePrice: 0,
    finalPrice: 0,
  },
  {
    id: 1,
    images: ['https://picsum.photos/200', 'https://picsum.photos/200'],
    name: 'Old product',
    description: 'My weird product',
    state: 'closed',
    proposePrice: 100,
    finalPrice: 150,
  },
];

function SessionList(props) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const proposePriceEle = useRef();
  const finalPriceEle = useRef();

  useEffect(() => {
    setSessions(mockData);
  }, []);

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

  const handleSubmitProposePrice = () => {
    const proposePrice = proposePriceEle.current.value;
    // TODO submit propose price
  };

  const handleSubmitFinalPrice = () => {
    const finalPrice = finalPriceEle.current.value;
    // TODO submit final price
  };

  const handleCloseSession = () => {
    // TODO close session.
  };

  return (
    <Layout>
      {!Boolean(currentSession) && (
        <div className="sessions">
          <h1 className="sessions__title">Session list page here</h1>
          <table className="sessions__table">
            <thead>
              <tr>
                <th>No</th>
                <th>Images</th>
                <th>Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Propose Price</th>
                <th>Final price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr className="session-info">
                  <td>{index + 1}</td>
                  <td>{renderImages(session.images)}</td>
                  <td>{session.name}</td>
                  <td>{session.state}</td>
                  <td>{session.description}</td>
                  <td>{session.proposePrice}</td>
                  <td>{session.finalPrice}</td>
                  <td>
                    <button type="button" onClick={handleViewDetail(index)}>
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
              State: <span>{currentSession.state}</span>
            </div>
            <div className="info__propose-price">
              <label>Propose price:</label>
              <input
                value={currentSession.proposePrice}
                ref={proposePriceEle}
              />
              <button onClick={handleSubmitProposePrice}>
                Submit propose price
              </button>
            </div>
            <div className="info__final-price">
              <label>Final price:</label>
              <input value={currentSession.finalPrice} ref={finalPriceEle} />
              <button onClick={handleSubmitFinalPrice}>Set final price</button>
            </div>
            <button onClick={handleCloseSession}>Close session</button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default SessionList;
