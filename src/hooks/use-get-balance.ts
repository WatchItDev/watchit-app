import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetVaultBalance } from '@src/hooks/use-get-vault-balance.ts';
import { setBalance } from '@redux/auth';

export function useGetBalance() {
  const balance = useSelector((state: any) => state.auth.balance);
  const sessionData = useSelector((state: any) => state.auth.session);
  const dispatch = useDispatch();

  const { balance: vaultBalance, refetch } = useGetVaultBalance(sessionData?.address);

  useEffect(() => {
    if (vaultBalance !== null && vaultBalance !== undefined) {
      dispatch(setBalance({ balance: vaultBalance }));
    }
  }, [vaultBalance, dispatch]);

  return { balance, refetch };
}
