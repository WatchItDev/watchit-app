// REACT IMPORTS
import { useState, useCallback } from 'react';

// VIEM IMPORTS
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';

// LOCAL IMPORTS
import AssetOwnershipAbi from '@src/config/abi/AssetOwnership.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { GetAssetOwnerError, UseGetAssetOwnerHook } from '@src/hooks/protocol/types.ts';

// ----------------------------------------------------------------------

/**
 * Hook to retrieve the owner's address of a specific asset.
 *
 * @returns {UseGetAssetOwnerHook} An object containing the owner's address, loading state, error information, and a function to fetch the owner's address.
 */
export const useGetAssetOwner = (): UseGetAssetOwnerHook => {
  // State variables
  const [ownerAddress, setOwnerAddress] = useState<Address | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<GetAssetOwnerError | null>(null);

  /**
   * Converts a hexadecimal asset ID to decimal.
   *
   * @param hexId - The asset ID in hexadecimal format.
   * @returns The asset ID in decimal format as a string.
   */
  const convertHexToDecimal = (hexId: string): string => {
    // Remove '0x' prefix if present
    const cleanHex = hexId.startsWith('0x') ? hexId.slice(2) : hexId;
    return BigInt(`0x${cleanHex}`).toString(10);
  };

  /**
   * Fetches the owner's address of the asset.
   *
   * @param assetIdHex - The asset ID in hexadecimal format.
   * @returns {Promise<Address | undefined>} The owner's address if successful, otherwise undefined.
   */
  const fetchOwnerAddress = useCallback(async (assetIdHex: string): Promise<Address | undefined> => {
    if (!assetIdHex) {
      setError({ message: 'Asset ID is missing.' });
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert assetId from hexadecimal to decimal
      const assetIdDecimal = convertHexToDecimal(assetIdHex);

      // Call the 'ownerOf' function on the AssetOwnership contract
      const owner = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ASSET_OWNERSHIP_ADDRESS,
        abi: AssetOwnershipAbi.abi,
        functionName: 'ownerOf',
        args: [assetIdDecimal],
      }) as Address;

      setOwnerAddress(owner);
      setError(null);
      return owner;
    } catch (err) {
      console.error('USE GET ASSET OWNER ERROR:', err);
      setOwnerAddress(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setError({ message: err?.message || 'An error occurred while retrieving the asset owner.' });
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ownerAddress,
    loading,
    error,
    fetchOwnerAddress,
  };
};
