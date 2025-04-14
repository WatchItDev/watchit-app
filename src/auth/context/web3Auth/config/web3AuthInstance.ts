import { ethers, BigNumber } from 'ethers';
import { chain } from './web3AuthSettings';
import { web3AuthFactory } from './web3AuthSettings';
import { modalConfig } from '@src/auth/context/web3Auth/config/web3AuthSettings.ts';

export const web3Auth = web3AuthFactory();

export async function initWeb3Auth() {
  await web3Auth.initModal({ modalConfig });
}

export async function getEthersProviderSigner() {
  if (!web3Auth.provider) throw new Error('Web3Auth provider not ready');

  const provider = new ethers.providers.Web3Provider(
    web3Auth.provider,
    parseInt(chain.polygonAmoy.chainId, 16)
  );

  /********************* 1. PATCH provider.request *************************/
  const origRequest = provider.provider.request!.bind(provider.provider);
  (provider.provider as any).request = async (args: { method: string; params?: any[] }) => {
    if (args.method === 'eth_sendTransaction' && Array.isArray(args.params)) {
      const raw = args.params[0];
      console.log('[DEBUG] provider.request - eth_sendTransaction called with:', raw);
      if (raw) {
        const normalized = await normalizeTx(raw, provider, /* asHex */ true);
        console.log('[DEBUG] Normalized tx (as hex) for provider.request:', normalized);
        args.params[0] = normalized;
      }
    }
    if (args.method === 'eth_sendUserOperation' && Array.isArray(args.params)) {
      const userOp = { ...args.params[0] };
      console.log('[DEBUG] Interceptando request para eth_sendUserOperation, userOp original:', userOp);
      userOp.callGasLimit = ethers.BigNumber.from(800_000).toHexString();
      userOp.verificationGasLimit = ethers.BigNumber.from(300_000).toHexString();
      userOp.preVerificationGas = ethers.BigNumber.from(120_000).toHexString();
      console.log('[DEBUG] UserOp modificado en request:', userOp);
      args.params[0] = userOp;
    }
    return origRequest(args);
  };

  if (provider.provider.sendAsync) {
    const origSendAsync = provider.provider.sendAsync.bind(provider.provider);
    (provider.provider as any).sendAsync = (payload: any, callback: (err: Error | null, result?: any) => void) => {
      if (payload.method === 'eth_sendUserOperation' && Array.isArray(payload.params)) {
        const userOp = { ...payload.params[0] };
        console.log('[DEBUG] Interceptando sendAsync para eth_sendUserOperation, userOp original:', userOp);
        userOp.callGasLimit = ethers.BigNumber.from(800_000).toHexString();
        userOp.verificationGasLimit = ethers.BigNumber.from(300_000).toHexString();
        userOp.preVerificationGas = ethers.BigNumber.from(120_000).toHexString();
        console.log('[DEBUG] UserOp modificado en sendAsync:', userOp);
        payload.params[0] = userOp;
      }
      return origSendAsync(payload, callback);
    };
  }

  /********************* 2. PATCH signer.sendTransaction *******************/
  const signer = provider.getSigner();
  const origSend = signer.sendTransaction.bind(signer);
  signer.sendTransaction = async (tx) => {
    const fixed = await normalizeTx(tx, provider, /* asHex */ false);
    console.log('[DEBUG] signer.sendTransaction - Normalized tx:', fixed);
    return origSend(fixed);
  };

  return { ethersProvider: provider, signer };
}

async function normalizeTx(tx: any, provider: ethers.providers.Provider, asHex = false) {
  const c: any = { ...tx };

  // 1. quitar type=2 huérfano
  if ((c.type === 2 || c.type === '0x2') &&
    c.maxFeePerGas == null && c.maxPriorityFeePerGas == null) {
    console.log('[DEBUG] Se remueve el type=2 porque faltan los fees EIP-1559');
    delete c.type;
  }

  // 2. gas -> gasLimit
  if (c.gas != null && c.gasLimit == null) {
    c.gasLimit = BigNumber.from(c.gas);
    console.log('[DEBUG] Convirtiendo "gas" a "gasLimit":', c.gas);
    delete c.gas;
  }
  if (c.gasLimit == null) {
    try {
      c.gasLimit = await provider.estimateGas(c);
      console.log('[DEBUG] Gas estimado:', c.gasLimit.toString());
    } catch (error) {
      console.error('[DEBUG] Error en estimateGas, usando fallback de 200k', error);
      c.gasLimit = BigNumber.from(800_000);
    }
  }

  // 3‑bis. fees: poner gasPrice si falta todo
  if (c.gasPrice == null && c.maxFeePerGas == null && c.maxPriorityFeePerGas == null) {
    const gp = await provider.getGasPrice();
    console.log('[DEBUG] GasPrice obtenido de la red:', gp.toString());
    c.gasPrice = BigNumber.from(gp);
  }

  // 4. hex‑strings para provider.request
  /* 4. Hex‑string para provider.request ------------------------------- */
  if (asHex) {
    const toHex = (v: any) => ethers.utils.hexValue(v);

    // gasLimit siempre en hex
    c.gasLimit = toHex(c.gasLimit);

    // *** NUEVO: Web3Auth AA necesita tx.gas ****
    c.gas      = c.gasLimit;            // 0x‑string

    if (c.gasPrice             != null) c.gasPrice             = toHex(c.gasPrice);
    if (c.maxFeePerGas         != null) c.maxFeePerGas         = toHex(c.maxFeePerGas);
    if (c.maxPriorityFeePerGas != null) c.maxPriorityFeePerGas = toHex(c.maxPriorityFeePerGas);

    // REAL FIX!!!!!!!!!!
    c.value = "0x0";         // ahora será "0x0"
  }

  console.log('[DEBUG] Transacción normalizada:', c);

  return c;
}
