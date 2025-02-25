// bindings.ts
import {IBindings} from "@lens-protocol/react-web";
import {Web3Provider} from "@ethersproject/providers";
import {web3Auth} from "./web3AuthInstance";

export const bindings: IBindings = {
  getProvider: async () => {
    if (!web3Auth.provider) {
      throw new Error("Web3Auth provider is not initialized");
    }

    // Create an ethers.js provider using the Web3Auth provider
    return new Web3Provider(web3Auth.provider);
  },
  getSigner: async () => {
    if (!web3Auth.provider) {
      throw new Error("Web3Auth provider is not initialized");
    }

    const ethersProvider = new Web3Provider(web3Auth.provider);
    return ethersProvider.getSigner();
  },
};
