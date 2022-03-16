import React, { useState, useEffect, useContext } from 'react';
import getWeb3 from './getWeb3';
import SimpleStorageContract from './contracts/SimpleStorage.json';

const defaultContract = {
  web3: null,
  contract: null,
  accounts: [],
  isAdmin: false,
};

export const AppContext = React.createContext({
  contractInfo: defaultContract,
  setContractInfo: () => {},
});

export const useContract = () => {
  const { contractInfo, setContractInfo } = useContext(AppContext);
  return { contractInfo, setContractInfo };
}

export default function AppContextProvider({ children }) {
  const [contractInfo, setContractInfo] = useState(defaultContract);

  useEffect(function () {
    async function init() {
      try {
        // Get network provider and web3 instanceß.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        console.log('accounts', accounts)
        console.log('web3', web3)
        console.log('contract', instance)

        setContractInfo({
          web3,
          contract: instance,
          accounts,
          isAdmin: false
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
    <AppContext.Provider value={{ contractInfo, setContractInfo }}>
      {children}
    </AppContext.Provider>
  );
}
