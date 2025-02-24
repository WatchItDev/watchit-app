import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useHasRole } from './use-has-role.ts'

interface UseIsVerifiedHook {
  isVerified: boolean | undefined;
  loading: boolean;
  error?: string | null;
}

export const useIsVerified = (account: Address): UseIsVerifiedHook => {
  const { hasRole, loading, error, fetchHasRole } = useHasRole()
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (account) {
      fetchHasRole(3, account) // Role ID 3 for verified
    }
  }, [account, fetchHasRole])

  useEffect(() => {
    if (!loading && hasRole !== undefined) {
      setIsVerified(hasRole)
    }
  }, [loading, hasRole])

  return {
    isVerified,
    loading,
    error: error?.message ?? null,
  }
}
