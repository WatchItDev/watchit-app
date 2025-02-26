// REACT IMPORTS
import { useState } from 'react';

// VIEM IMPORTS
import { encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import AssetOwnershipAbi from '@src/config/abi/AssetOwnership.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { TransferAssetData, UseTransferAssetHook } from '@src/hooks/protocol/types.ts';

// ----------------------------------------------------------------------

/**
 * Hook to transfer an asset using the Asset Ownership contract
 * with Account Abstraction (Bundler Client).
 *
 * @returns {UseTransferAssetHook} data, transferAsset, loading, and error
 */
export const useTransferAsset = (): UseTransferAssetHook => {
  const [data, setData] = useState<TransferAssetData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isAuthenticated, logout } = useAccountSession();

  /**
   * Performs the operation of transferring an asset using the `AssetOwnership` contract.
   *
   * @param destinationAddress The address to which the asset will be transferred
   * @param assetId The ID of the asset to transfer
   */
  const transferAsset = async (destinationAddress: string, assetId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!sessionData?.authenticated) {
      setError(ERRORS.SUBSCRIBE_LOGIN_ERROR);
      setLoading(false);
      return;
    }

    if (!isAuthenticated()) {
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const fromAddress = sessionData?.profile?.ownedBy.address;
      if (!fromAddress) {
        throw new Error('The active account address was not found in the session.');
      }

      console.log('destinationAddress:', destinationAddress);
      console.log('asset:', assetId);

      const transferAssetData = encodeFunctionData({
        abi: AssetOwnershipAbi.abi,
        functionName: 'transfer',
        args: [destinationAddress, assetId],
      });

      const calls = [
        {
          to: GLOBAL_CONSTANTS.ASSET_OWNERSHIP_ADDRESS,
          value: 0,
          data: transferAssetData,
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
    } catch (err: any) {
      console.error('USE TRANSFER ASSET ERROR:', err);
      setLoading(false);
      setError(ERRORS.ASSET_OWNERSHIP_TRANSFER_ERROR);
    }
  };

  return {
    data,
    transferAsset,
    loading,
    error,
  };
};
