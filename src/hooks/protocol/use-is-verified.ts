// REACT IMPORTS
import { useEffect, useState } from 'react';
import { Address } from 'viem';

// LOCAL IMPORTS
import { useHasRole } from './use-has-role.ts';
import { UseIsVerifiedHook } from '@src/hooks/protocol/types.ts';

// ----------------------------------------------------------------------

export const useIsVerified = (account: Address): UseIsVerifiedHook => {
  const { hasRole, loading, error, fetchHasRole } = useHasRole();
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (account) {
      fetchHasRole(3, account); // Role ID 3 for verified
    }
  }, [account]);

  useEffect(() => {
    if (!loading && hasRole !== undefined) {
      setIsVerified(hasRole);
    }
  }, [loading, hasRole]);

  return {
    isVerified,
    loading,
    error: error?.message ?? null,
  };
};
