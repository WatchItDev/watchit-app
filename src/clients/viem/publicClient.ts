import { createPublicClient, http, webSocket } from 'viem';
import { polygonAmoy } from 'viem/chains';

const WS_URL = 'wss://polygon-amoy-bor-rpc.publicnode.com';

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(polygonAmoy.rpcUrls.default.http[0]),
});

export const publicClientWebSocket = createPublicClient({
  chain: polygonAmoy,
  transport: webSocket(WS_URL),
});
