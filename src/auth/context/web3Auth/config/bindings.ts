import { IBindings } from '@lens-protocol/react-web';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getEthersProviderSigner } from './web3AuthInstance';

export const bindings: IBindings = {
  getProvider: async () => (await getEthersProviderSigner()).ethersProvider as JsonRpcProvider,
  getSigner  : async () => (await getEthersProviderSigner()).signer
};
