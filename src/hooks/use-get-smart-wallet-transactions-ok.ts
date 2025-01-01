import { useEffect, useState } from 'react'
import axios from 'axios'
import { Address } from 'viem';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

interface SmartWalletTransactionParams {
  chainShortName?: string; // Blockchain network abbreviation (e.g., 'eth')
  address: Address; // Address to query
  protocolType?: string; // Token protocol type (default: 'token_20')
  tokenContractAddress?: string; // Optional token contract address
  startBlockHeight?: string; // Optional starting block height
  endBlockHeight?: string; // Optional ending block height
  isFromOrTo?: 'from' | 'to'; // Filter transactions by 'from' or 'to'
  page?: number; // Optional page number
  limit?: number; // Number of results per request (default: 20, max: 50)
}

interface UseGetSmartWalletTransactionsReturn {
  data: any;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetSmartWalletTransactions({
                                                address,
                                                chainShortName = 'AMOY_TESTNET',
                                                protocolType = 'token_20',
                                                tokenContractAddress = GLOBAL_CONSTANTS.MMC_ADDRESS,
                                                startBlockHeight,
                                                endBlockHeight,
                                                isFromOrTo,
                                                page = 1,
                                                limit = 20,
                                              }: SmartWalletTransactionParams): UseGetSmartWalletTransactionsReturn {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create an axios instance
  const axiosInstance = axios.create({
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
      'OK-ACCESS-KEY': GLOBAL_CONSTANTS.OKLINK_API_KEY,
    },
    timeout: 5000,
    validateStatus: (status) => status < 600,
  });

  // Fetch transactions using GET request
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query string
      const queryParams = new URLSearchParams({
        chainShortName,
        address,
        protocolType,
        ...(tokenContractAddress && { tokenContractAddress }),
        ...(startBlockHeight && { startBlockHeight }),
        ...(endBlockHeight && { endBlockHeight }),
        ...(isFromOrTo && { isFromOrTo }),
        page: page.toString(),
        limit: limit.toString(),
      }).toString();

      const url = `https://www.oklink.com/api/v5/explorer/address/token-transaction-list?${queryParams}`;
      const response = await axiosInstance.get(url);

      console.log('response', response);

      // Handle response
      if (response.data?.code === '0') {
        setData(response.data.data?.[0]);
      } else {
        setError(response.data?.msg || 'Unknown error');
      }
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on parameter change
  useEffect(() => {
    if (!address || !chainShortName) return;
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainShortName, address, protocolType, tokenContractAddress, startBlockHeight, endBlockHeight, isFromOrTo, page, limit]);

  // Refetch function
  const refetch = async () => {
    await fetchTransactions();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
