import { useState, useEffect } from 'react';
import { Address, parseAbiItem, formatUnits } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';

export type TransactionLog = {
  address: string;
  args: {
    amount: bigint;
    currency: string;
    recipient: string;
    sender: string;
  };
  blockHash: string;
  blockNumber: bigint;
  data: string;
  event: string;
  eventName: string;
  formattedAmount: string;
  logIndex: number;
  readableDate: string;
  removed: boolean;
  timestamp: bigint;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
};

const useGetSmartWalletTransactions = () => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    console.log('Fetching logs for address:', sessionData?.address);
    if (!sessionData?.address) return;

    try {
      setLoading(true);
      setError(null);

      // Define ABI for events to monitor
      const eventsAbi = {
        FundsTransferred: parseAbiItem(
          createEventSignature(
            LedgerVaultAbi.abi.find(
              (item: any) => item.type === 'event' && item.name === 'FundsTransferred'
            )
          )
        ),
        FundsDeposited: parseAbiItem(
          createEventSignature(
            LedgerVaultAbi.abi.find(
              (item: any) => item.type === 'event' && item.name === 'FundsDeposited'
            )
          )
        ),
        FundsWithdrawn: parseAbiItem(
          createEventSignature(
            LedgerVaultAbi.abi.find(
              (item: any) => item.type === 'event' && item.name === 'FundsWithdrawn'
            )
          )
        ),
      };

      // Fetch logs for each event
      const [transfersToMe, transfersFromMe, deposits, withdraws] = await Promise.all([
        publicClient.getLogs({
          address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS as Address,
          event: eventsAbi.FundsTransferred as any,
          args: { recipient: sessionData.address },
          fromBlock: 0n,
          toBlock: 'latest',
        }),
        publicClient.getLogs({
          address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS as Address,
          event: eventsAbi.FundsTransferred as any,
          args: { sender: sessionData.address },
          fromBlock: 0n,
          toBlock: 'latest',
        }),
        publicClient.getLogs({
          address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS as Address,
          event: eventsAbi.FundsDeposited as any,
          args: { recipient: sessionData.address },
          fromBlock: 0n,
          toBlock: 'latest',
        }),
        publicClient.getLogs({
          address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS as Address,
          event: eventsAbi.FundsWithdrawn as any,
          args: { origin: sessionData.address },
          fromBlock: 0n,
          toBlock: 'latest',
        }),
      ]);

      const allLogs = [...transfersToMe, ...transfersFromMe, ...deposits, ...withdraws];

      // Add timestamps and format details for each log
      const logsWithDetails = await Promise.all(
        allLogs.map(async (log: any) => {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });

          // Determine the event type
          const event = (() => {
            switch (log.eventName) {
              case 'FundsTransferred':
                return log.args.sender === sessionData.address
                  ? 'transferTo'
                  : 'transferFrom';
              case 'FundsDeposited':
                return 'deposit';
              case 'FundsWithdrawn':
                return 'withdraw';
              default:
                return 'unknown';
            }
          })();

          return {
            ...log,
            timestamp: block.timestamp, // UNIX timestamp of the block
            readableDate: new Date(Number(block.timestamp) * 1000).toLocaleString(), // Human-readable date
            formattedAmount: log.args.amount ? formatUnits(log.args.amount, 18) : null, // Convert amount from wei to ether
            event,
          };
        })
      );

      // Sort logs by block and transaction index
      const sortedLogs = logsWithDetails.sort((a, b) => {
        const blockDifference = Number(b.blockNumber) - Number(a.blockNumber);
        if (blockDifference !== 0) return blockDifference;
        return Number(b.transactionIndex) - Number(a.transactionIndex);
      });

      setLogs(sortedLogs);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createEventSignature = (event: any): string => {
    if (!event || !event.name || !event.inputs) {
      throw new Error('Invalid event in ABI');
    }
    const inputs = event.inputs
      .map(
        (input: any) =>
          `${input.type}${input.indexed ? ' indexed' : ''} ${input.name}`
      )
      .join(', ');
    return `event ${event.name}(${inputs})`;
  };

  useEffect(() => {
    fetchLogs();
  }, [sessionData?.address]);

  return { logs, loading, error, refetch: fetchLogs };
};

export default useGetSmartWalletTransactions;
