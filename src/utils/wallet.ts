import type { AccountAbstractionProvider } from "@web3auth/account-abstraction-provider";
import { Web3Auth } from '@web3auth/modal/dist/types/modalManager';

// ----------------------------------------------------------------------

export const truncateAddress = (text: string, startChars= 6, endChars= 6) => {
  if (!text) return '';

  if (text.length <= startChars + endChars) {
    return text;
  }
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
};

export const replacePrefix = (hash: string) => {
  if (hash.startsWith('0x')) {
    return 'f0' + hash.slice(2);
  }
  return hash;
};

export const ensureAAReady = async (w3a: Web3Auth): Promise<{
  aaprovider: AccountAbstractionProvider;
  smartAccount: AccountAbstractionProvider["smartAccount"];
  bundlerClient: AccountAbstractionProvider["bundlerClient"];
}> => {
  const aaprovider = w3a.options?.accountAbstractionProvider as
    | AccountAbstractionProvider
    | undefined;

  if (!aaprovider) throw new Error("AA provider missing in Web3Auth");

  // Si ya está listo, devuelve enseguida
  if (aaprovider.smartAccount?.address) {
    return {
      aaprovider,
      smartAccount: aaprovider.smartAccount,
      bundlerClient: aaprovider.bundlerClient,
    };
  }

  // Espera a que emita el evento "READY"
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("AA init timeout")), 10_000);
    aaprovider.once?.('connect', () => {
      clearTimeout(timeout);
      resolve();
    });
  });

  if (!aaprovider.smartAccount?.address) {
    throw new Error("AA provider still not ready after READY event");
  }

  return {
    aaprovider,
    smartAccount: aaprovider.smartAccount,
    bundlerClient: aaprovider.bundlerClient,
  };
}
