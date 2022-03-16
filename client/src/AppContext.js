import React, { useState, useEffect, useContext } from 'react';
import getWeb3 from './getWeb3';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import MainContract from './contracts/Main.json';

const defaultContract = {
  web3: null,
  contract: null,
  accounts: [],
  role: 0,
};

export const AppContext = React.createContext({
  appInfo: defaultContract,
  setAppInfo: () => {},
});

export const useAppInfo = () => {
  const { appInfo, setAppInfo } = useContext(AppContext);
  return { appInfo, setAppInfo };
}

export default function AppContextProvider({ children }) {
  const [appInfo, setAppInfo] = useState(defaultContract);

  useEffect(function () {
    async function init() {
      try {
        // Get network provider and web3 instanceß.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MainContract.networks[networkId];
        const instance = new web3.eth.Contract(
          MainContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setAppInfo({
          web3,
          contract: instance,
          accounts,
          role: 0
        });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    }

    init();
  }, []);

  return (
    <AppContext.Provider value={{ appInfo, setAppInfo }}>
      {children}
    </AppContext.Provider>
  );
}
