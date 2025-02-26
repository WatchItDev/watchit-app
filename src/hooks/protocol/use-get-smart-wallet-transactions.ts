import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parseAbiItem, formatUnits, Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { addTransaction, setTransactions } from '@redux/transactions';
import { EventConfig } from '@src/hooks/protocol/types.ts';
import { RootState } from '@redux/store.ts';

/**
 * Hook to retrieve smart wallet transactions by querying logs from the LedgerVault contract.
 * It also manages live updates when new events are detected in real time.
 */
export default function useGetSmartWalletTransactions() {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: RootState) => state.auth.session);
  const blockchainEvents = useSelector((state: RootState) => state.blockchainEvents.events);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * We define all event configurations that we want to capture.
   *    Each configuration includes:
   *      - The event name.
   *      - An object "args" that indicates which fields in the log must match the user's address.
   *      - A function to map the raw event to a custom "event type" (transferFrom, transferTo, deposit, etc.).
   */
  const eventConfigs: EventConfig[] = [
    {
      eventName: 'FundsTransferred',
      args: { recipient: sessionData.address || '' },
      getEventType: (log, userAddress) =>
        log.args.origin === userAddress ? 'transferTo' : 'transferFrom',
    },
    {
      eventName: 'FundsTransferred',
      args: { origin: sessionData?.address || '' },
      getEventType: (log, userAddress) =>
        log.args.origin === userAddress ? 'transferTo' : 'transferFrom',
    },
    {
      eventName: 'FundsDeposited',
      args: { recipient: sessionData?.address || '' },
      getEventType: () => 'deposit',
    },
    {
      eventName: 'FundsWithdrawn',
      args: { origin: sessionData?.address || '' },
      getEventType: () => 'withdraw',
    },
    {
    eventName: 'FundsCollected',
    args: { from: sessionData?.address || '' },
    getEventType: () => 'collected',
    },
  ];

  /**
   *  Helper function to create the event signature needed by viem's parseAbiItem().
   *    For example, an event signature looks like "event FundsTransferred(address indexed origin, address indexed recipient, ...)".
   */
  const createEventSignature = (event: any): string => {
    if (!event?.name || !event.inputs) {
      throw new Error('Invalid event in ABI');
    }
    const inputs = event.inputs
      .map((input: any) => `${input.type}${input.indexed ? ' indexed' : ''} ${input.name}`)
      .join(', ');
    return `event ${event.name}(${inputs})`;
  };

  /**
   * Generate a dictionary (object) of parsed ABIs based on all unique event names in the eventConfigs.
   *    a) Extract unique event names (e.g. FundsTransferred, FundsDeposited, etc.).
   *    b) Find those events in the LedgerVaultAbi and parse them with parseAbiItem().
   */
  const uniqueEventNames = Array.from(
    new Set(eventConfigs.map((config) => config.eventName)) // Removes duplicates
  );

  const parsedAbis = uniqueEventNames.reduce((acc, eventName) => {
    const eventAbi = LedgerVaultAbi.abi.find(
      (item: any) => item.type === 'event' && item.name === eventName
    );
    if (!eventAbi) {
      throw new Error(`No definition found for event ${eventName} in the ABI`);
    }
    acc[eventName] = parseAbiItem(createEventSignature(eventAbi));
    return acc;
  }, {} as Record<string, ReturnType<typeof parseAbiItem>>);

  /**
   *  Function to fetch historical logs from the LedgerVault contract, using the user's address as a filter.
   *    The logs are then sorted, processed, and stored in Redux.
   */
  const fetchLogs = async () => {
    if (!sessionData?.address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // a) Build an array of promises, one for each eventConfig, calling publicClient.getLogs.
      const promises = eventConfigs.map(({ eventName, args }) => {
        return publicClient.getLogs({
          address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS as Address,
          event: parsedAbis[eventName] as any,
          args,
          fromBlock: 0n,
          toBlock: 'latest',
        });
      });

      // b) Execute all the promises in parallel.
      const results = await Promise.all(promises);

      // c) Flatten the array of arrays of logs into one array.
      const allLogs = results.flat();

      // d) Fetch block timestamps for each log and map them to a structured format.
      const logsWithDetails = await Promise.all(
        allLogs.map(async (log: any) => {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });

          // Find the event config to determine the custom "eventType".
          const foundConfig = eventConfigs.find((c) => c.eventName === log.eventName);
          const eventType = foundConfig
            ? foundConfig.getEventType(log, sessionData?.address)
            : 'unknown';

          return {
            ...log,
            timestamp: block.timestamp,
            readableDate: new Date(Number(block.timestamp) * 1000).toLocaleString(),
            formattedAmount: log.args.amount ? formatUnits(log.args.amount, 18) : '0',
            event: eventType,
          };
        })
      );

      // e) Sort logs by blockNumber descending, then by transactionIndex descending.
      const sortedLogs = logsWithDetails.sort((a, b) => {
        const blockDifference = Number(b.blockNumber) - Number(a.blockNumber);
        if (blockDifference !== 0) return blockDifference;
        return Number(b.transactionIndex) - Number(a.transactionIndex);
      });

      // Finally, update Redux state with the sorted logs.
      dispatch(setTransactions(sortedLogs));
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  /**
   *  useEffect hook that fires when the user's address changes, triggering the fetchLogs function.
   *    If there's already a list of transactions, we can stop showing the loader.
   */
  useEffect(() => {
    fetchLogs();
    if (transactions.length) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData?.address]);

  /**
   *  Real-time events handling:
   *    When a new event is picked up in `blockchainEvents`, we check if it's from the LedgerVault contract and
   *    if it's one of the recognized event names. If yes, we process it similarly (fetch block info, add extra fields)
   *    and then dispatch addTransaction to Redux.
   */
  useEffect(() => {
    if (!blockchainEvents?.length) return;

    blockchainEvents.forEach(async (log: any) => {
      // Filter out logs not from our contract or event names not in use.
      if (
        log.address !== GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS ||
        !uniqueEventNames.includes(log.eventName)
      ) {
        return;
      }

      try {
        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
        const foundConfig = eventConfigs.find((c) => c.eventName === log.eventName);
        const eventType = foundConfig
          ? foundConfig.getEventType(log, sessionData?.address)
          : 'unknown';

        const formattedLog = {
          ...log,
          timestamp: block.timestamp,
          readableDate: new Date(Number(block.timestamp) * 1000).toLocaleString(),
          formattedAmount: log.args.amount ? formatUnits(log.args.amount, 18) : '0',
          event: eventType,
        };

        dispatch(addTransaction(formattedLog));
      } catch (err) {
        console.error('Error processing real-time log:', err);
      }
    });
  }, [blockchainEvents, sessionData?.address, uniqueEventNames, eventConfigs]);

  return { transactions, loading, error };
}
