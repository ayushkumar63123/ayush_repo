import { InjectedConnector } from '@web3-react/injected-connector'
import { Web3Provider } from "@ethersproject/providers"

export const injected = new InjectedConnector({
    supportedChainIds: [56],
  })

export const getLibrary = (provider: any, connector: any) => {
    //@ts.ignore
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  };