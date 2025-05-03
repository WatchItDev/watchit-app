// REACT IMPORTS
import { useState } from 'react';

// VIEM IMPORTS
import { encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import AssetOwnershipAbi from '@src/config/abi/AssetOwnership.json';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { RegisterAssetData, UseRegisterAssetHook } from '@src/hooks/protocol/types.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';

// ----------------------------------------------------------------------

/**
 * Hook to register a new asset in the Asset Ownership contract
 * using Account Abstraction (Bundler Client).
 *
 * @returns {UseRegisterAssetHook} data, registerAsset, loading y error
 */
export const useRegisterAsset = (): UseRegisterAssetHook => {
  const [data, setData] = useState<RegisterAssetData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { session: sessionData, isFullyAuthenticated: isAuthenticated } = useAuth();
  const { bundlerClient, smartAccount } = useWeb3Auth();
  const { logout } = useAccountSession();


  /**
   * Performs the operation of registering an asset using the `AssetOwnership` contract.
   *
   * @param assetId The ID of the asset you want to register
   */
  const registerAsset = async (assetId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!sessionData?.authenticated) {
      setError(ERRORS.SUBSCRIBE_LOGIN_ERROR);
      setLoading(false);
      return;
    }

    if (!isAuthenticated) {
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const toAddress = sessionData?.profile?.ownedBy.address;
      if (!toAddress) {
        throw new Error('The active account address was not found in the session.');
      }

      const registerAssetData = encodeFunctionData({
        abi: AssetOwnershipAbi.abi,
        functionName: 'register',
        args: [toAddress, assetId],
      });

      const calls = [
        {
          to: GLOBAL_CONSTANTS.ASSET_OWNERSHIP_ADDRESS,
          value: 0,
          data: registerAssetData,
        },
      ];

      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls,
      });

      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      setData({ receipt });
      setLoading(false);
    } catch (err) {
      console.error('USE REGISTER ASSET ERR:', err);
      setLoading(false);
      throw new Error('There is an error while registering the asset');
    }
  };

  return {
    data,
    registerAsset,
    loading,
    error,
  };
};
