import { getAccountNonce } from "permissionless/actions";
import { publicClient } from "@src/clients/viem/publicClient";
import type { Address } from "viem";
import type { AccountAbstractionProvider, Web3Auth } from "@web3auth/modal";
import type { SmartAccount } from "viem/account-abstraction";

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

export const ensureAAReady = (w3a: Web3Auth | null | undefined): {
  aaprovider: AccountAbstractionProvider;
  smartAccount: AccountAbstractionProvider["smartAccount"];
  bundlerClient: AccountAbstractionProvider["bundlerClient"];
} => {
  if (!w3a)
    throw new Error("Web3Auth instance not initialised (is null)");

  const aaprovider = w3a
    .accountAbstractionProvider as AccountAbstractionProvider | undefined;

  if (!aaprovider?.smartAccount?.address)
    throw new Error("Smart-Account provider not ready");

  return {
    aaprovider,
    smartAccount: aaprovider.smartAccount,
    bundlerClient: aaprovider.bundlerClient,
  };
};

export const getNonce = async (smartAccount: SmartAccount): Promise<bigint> =>
  getAccountNonce(publicClient, {
    address: smartAccount.address as Address,
    entryPointAddress: smartAccount.entryPoint.address as Address,
    key: 0n,
  });
