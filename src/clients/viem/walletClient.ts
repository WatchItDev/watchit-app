import {createWalletClient, custom} from "viem";
import {polygonAmoy} from "viem/chains";
import "viem/window";
import {publicClient} from "@src/clients/viem/publicClient";


export async function ConnectWalletClient() {
  // window.ethereum is an object provided by MetaMask or other web3 wallets
  let transport;
  if (window.ethereum) {
    // If window.ethereum exists, create a custom transport using it
    transport = custom(window.ethereum);
  } else {
    // If window.ethereum is not available, throw an error
    const errorMessage =
      "MetaMask or another web3 wallet is not installed. Please install one to proceed.";
    throw new Error(errorMessage);
  }
  // Return the wallet client
  return createWalletClient({
    chain: polygonAmoy,
    transport: transport,
  });
}

export function ConnectPublicClient() {
  return publicClient
}
