// REACT IMPORTS
import { useCallback, useState } from 'react';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import { publicClient } from '@src/clients/viem/publicClient.ts';
import AccessManagerAbi from '@src/config/abi/AccessManager.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { HasAccessError, UseHasRoleHook } from '@src/hooks/protocol/types.ts';

// ----------------------------------------------------------------------

export const useHasRole = (): UseHasRoleHook => {
  const [hasRole, setHasRole] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchHasRole = useCallback(async (roleId: number, account: Address) => {
    setLoading(true);
    try {
      const roleData = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ACCESS_MANAGER_ADDRESS,
        abi: AccessManagerAbi.abi,
        functionName: 'hasRole',
        args: [roleId, account],
      }) as readonly [boolean, number];

      const role = Boolean(roleData[0]);
      setHasRole(role);
      setError(null);
    } catch (err) {
      console.error('Error checking access:', err);
      setHasRole(undefined);
      setError({ message: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    hasRole,
    loading,
    error,
    fetchHasRole,
  };
};
