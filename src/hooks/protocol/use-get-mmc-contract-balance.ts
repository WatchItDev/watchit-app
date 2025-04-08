import { useState, useEffect, useCallback } from 'react';
import { formatUnits, Address } from 'viem';
import MMCAbi from '@src/config/abi/MMC.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { useSelector } from 'react-redux';
import {RootState} from "@redux/store.ts"

export function useGetMmcContractBalance(address?: Address) {
  const [balance, setBalance] = useState<number | null>(null);
  const blockchainEvents = useSelector((state: RootState) => state.blockchainEvents.events);

  const fetchBalance = useCallback(async () => {
    if (!address) return;

    try {
      const rawBalance = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.MMC_ADDRESS,
        abi: MMCAbi.abi,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

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
