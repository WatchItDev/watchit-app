import { createPublicClient, http, webSocket } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// const WS_URL = 'wss://polygon-amoy-bor-rpc.publicnode.com';

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  // transport: http(polygonAmoy.rpcUrls.default.http[0]),
  transport: http(GLOBAL_CONSTANTS.POLYGON_AMOY_RPC),
});

export const publicClientWebSocket = createPublicClient({
  chain: polygonAmoy,
  // transport: webSocket(WS_URL),
  transport: webSocket(GLOBAL_CONSTANTS.POLYGON_AMOY_WS),
});
