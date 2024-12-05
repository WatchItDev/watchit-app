import { useState, useEffect } from 'react';
import { formatUnits, Address } from 'viem';
import MMCAbi from '@src/config/abi/MMC.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { publicClient } from '@src/clients/viem/publicClient.ts';

export function useGetBalance(address?: Address) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      try {
        const rawBalance: any = await publicClient.readContract({
          address: GLOBAL_CONSTANTS.MMC_ADDRESS,
          abi: MMCAbi.abi,
          functionName: 'balanceOf',
          args: [address],
        });

        const formattedBalance = parseFloat(formatUnits(rawBalance, 18));
        setBalance(isNaN(formattedBalance) ? 0 : formattedBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      }
    };

    fetchBalance();
  }, [address]);

  return balance;
}
