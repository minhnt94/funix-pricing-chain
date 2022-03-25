import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppInfo } from '../../AppContext';
import { ROLE } from '../../constants';
import './Header.scss';

function Header() {
  const { appInfo } = useAppInfo();

  const isAdmin = appInfo.role === ROLE.ADMIN;
  const isParticipant = appInfo.role === ROLE.PARTICIPANT;

  return (
    <header className="header p-3 bg-primary">
      <nav>
        <ul>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? 'active' : '')}
              to="/sessions"
            >
              Home
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink
                className={(navData) => (navData.isActive ? 'active' : '')}
                to="/participants"
              >
                Participants
              </NavLink>
            </li>
          )}
          {isParticipant && (
            <li>
              <NavLink
                className={(navData) => (navData.isActive ? 'active' : '')}
                to="/info"
              >
                Edit profile
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
