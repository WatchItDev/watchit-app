import {ReadResult} from "@lens-protocol/react/dist/declarations/src/helpers/reads"

import {AnyPublication} from "@lens-protocol/api-bindings"

export type PublicationHookType =  ReadResult<AnyPublication>;

interface EthereumProvider {
  isMetaMask?: boolean;
}

// Augment the Window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
