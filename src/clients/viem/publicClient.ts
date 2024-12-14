import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(polygonAmoy.rpcUrls.default.http[0]),
});


export const createClient = (provider: any) => createWalletClient({
  account: "0x4AEa45E7c5a1C63424D003114b9C80F4DEa64c1B",
  chain: polygonAmoy,
  transport: custom(provider),
});


export const publicClient2 = (provider: any)=> createPublicClient({
  chain: polygonAmoy,
  transport: custom(provider),
});