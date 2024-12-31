import { useState, useEffect } from 'react';
import { parseAbiItem, formatUnits, Address } from 'viem';
import { useDispatch, useSelector } from 'react-redux';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { addTransaction, setTransactions } from '@redux/transactions';

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
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);
  const blockchainEvents = useSelector((state: any) => state.blockchainEvents.events);
  const transactions = useSelector((state: any) => state.transactions.transactions);

  // Local states for loading and error
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch historical logs
  const fetchLogs = async () => {
    console.log('Fetching logs for address:', sessionData?.address);
    if (!sessionData?.address) {
      setLoading(false);
      return;
    }

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
                return log.args.sender === sessionData.address ? 'transferTo' : 'transferFrom';
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
            formattedAmount: log.args.amount ? formatUnits(log.args.amount, 18) : '0', // Convert amount from wei to ether
            event,
          };
        })
      );

      // Sort logs by block number and transaction index
      const sortedLogs = logsWithDetails.sort((a, b) => {
        const blockDifference = Number(b.blockNumber) - Number(a.blockNumber);
        if (blockDifference !== 0) return blockDifference;
        return Number(b.transactionIndex) - Number(a.transactionIndex);
      });

      // Dispatch the setTransactions action to store the logs in Redux
      dispatch(setTransactions(sortedLogs));
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create event signatures
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

  // Effect to fetch historical logs when the address changes
  useEffect(() => {
    fetchLogs();
  }, [sessionData?.address]);

  // Effect to handle real-time events from blockchainEvents
  useEffect(() => {
    if (!blockchainEvents || blockchainEvents.length === 0) return;

    // Iterate over new blockchain events
    blockchainEvents.forEach(async (log: any) => {
      // Process only relevant events
      if (
        log.address !== GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS ||
        !['FundsTransferred', 'FundsDeposited', 'FundsWithdrawn'].includes(log.eventName)
      ) {
        return;
      }

      try {
        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });

        // Determine the event type
        const event = (() => {
          switch (log.eventName) {
            case 'FundsTransferred':
              return log.args.sender === sessionData.address ? 'transferTo' : 'transferFrom';
            case 'FundsDeposited':
              return 'deposit';
            case 'FundsWithdrawn':
              return 'withdraw';
            default:
              return 'unknown';
          }
        })();

        // Create a formatted transaction log
        const formattedLog = {
          ...log,
          timestamp: block.timestamp, // UNIX timestamp of the block
          readableDate: new Date(Number(block.timestamp) * 1000).toLocaleString(), // Human-readable date
          formattedAmount: log.args.amount ? formatUnits(log.args.amount, 18) : '0', // Convert amount from wei to ether
          event,
        };

        // Dispatch the addTransaction action to add the new log to Redux
        dispatch(addTransaction(formattedLog));
      } catch (err) {
        console.error('Error processing real-time log:', err);
      }
    });
  }, [blockchainEvents, sessionData?.address, dispatch]);

  return { transactions, loading, error };
};

export default useGetSmartWalletTransactions;
