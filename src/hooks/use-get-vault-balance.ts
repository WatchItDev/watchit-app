import { useState, useEffect, useCallback } from 'react';
import { formatUnits, Address } from 'viem';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { useSelector } from 'react-redux';

export function useGetVaultBalance(address: Address) {
  const [balance, setBalance] = useState<number | null>(null);
  const blockchainEvents = useSelector((state: any) => state.blockchainEvents.events);

  const fetchBalance = useCallback(async () => {
    if (!address) return;

    try {
      const rawBalance: any = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
        abi: LedgerVaultAbi.abi,
        functionName: 'getLedgerBalance',
        args: [address, GLOBAL_CONSTANTS.MMC_ADDRESS],
      });

      const formattedBalance = parseFloat(formatUnits(rawBalance, 18));
      setBalance(isNaN(formattedBalance) ? 0 : formattedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address, blockchainEvents]);

  return { balance, refetch: fetchBalance };
}
