import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppInfo } from '../AppContext';
import { ROLE } from '../constants';

export const useCheckUser = () => {
  const { appInfo } = useAppInfo();
  const navigate = useNavigate()

  useEffect(() => {
    async function checkUser() {
      const { accounts, contract } = appInfo;
      if (contract) {
        const role = parseInt(
          await contract.methods.checkRole().call({ from: accounts[0] })
        );
        if(role === ROLE.UNREGISTER) {
          navigate('/login')
        }
      }
    };

    checkUser();
  }, [appInfo.contract]);
}
