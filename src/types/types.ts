interface EthereumProvider {
  isMetaMask?: boolean;
}

// Augment the Window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
