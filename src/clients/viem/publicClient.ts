import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(polygonAmoy.rpcUrls.default.http[0]),
});
