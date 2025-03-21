import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetVaultBalance } from '@src/hooks/protocol/use-get-vault-balance.ts';
import { setBalance } from '@redux/auth';
import { useAuth } from '@src/hooks/use-auth.ts';

export function useGetBalance() {
  const { session: sessionData, balance } = useAuth();
  const dispatch = useDispatch();
  const { balance: vaultBalance, refetch } = useGetVaultBalance(sessionData?.address);

  useEffect(() => {
    if (vaultBalance !== null && vaultBalance !== undefined) {
      dispatch(setBalance({ balance: vaultBalance }));
    }
  }, [vaultBalance, dispatch]);

  return { balance, refetch };
}
