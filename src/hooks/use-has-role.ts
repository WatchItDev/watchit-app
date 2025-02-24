import { useCallback, useState } from 'react'
import { Address } from 'viem'
import { publicClient } from '@src/clients/viem/publicClient'
import AccessManagerAbi from '@src/config/abi/AccessManager.json'
import { GLOBAL_CONSTANTS } from '@src/config-global.ts'

interface HasRoleError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface UseHasRoleHook {
  hasRole?: boolean;
  loading: boolean;
  error?: HasRoleError | null;
  fetchHasRole: (roleId: number, account: Address) => void;
}

export const useHasRole = (): UseHasRoleHook => {
  const [hasRole, setHasRole] = useState<boolean | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<HasRoleError | null>(null)

  const fetchHasRole = useCallback(async (roleId: number, account: Address) => {
    setLoading(true)
    try {
      const roleData: any = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ACCESS_MANAGER_ADDRESS,
        abi: AccessManagerAbi.abi,
        functionName: 'hasRole',
        args: [roleId, account],
      })

      const role = Boolean(roleData?.[0])
      setHasRole(role)
      setError(null)
    } catch (err: any) {
      console.error('Error checking access:', err)
      setHasRole(undefined)
      setError({ message: err?.message || 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    hasRole,
    loading,
    error,
    fetchHasRole,
  }
}
