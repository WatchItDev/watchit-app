import { useEffect, useState } from 'react';
import { useGetVaultBalance } from '@src/hooks/protocol/use-get-vault-balance.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

export function useGetBalance(props?: { pollInterval?: number }) {
  let interval: ReturnType<typeof setInterval>;
  const [balance, setBalance] = useState(0);
  const { session: sessionData } = useAuth();
  const { balance: vaultBalance, refetch } = useGetVaultBalance(
    sessionData?.address,
  );

  useEffect(() => {
    if (props?.pollInterval) {
      interval = setInterval(() => {
        refetch();
      }, props.pollInterval);
    }
    return () => interval && clearInterval(interval);
  }, [props?.pollInterval]);

  useEffect(() => {
    if (!vaultBalance) return;
    setBalance(vaultBalance);
  }, [vaultBalance]);

  return { balance, refetch };
}
