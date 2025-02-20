import { useState } from 'react';
import { useSelector } from 'react-redux';
import { parseAbiItem, formatUnits, Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';

/**
 * Type definition for a transaction log, including event data and relevant block/transaction metadata.
 */
export type TransactionLog = {
  address: string;
  args: {
    amount: bigint;
    currency: string;
    recipient: string;
    origin: string;
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

/**
 * Configuration object for each event:
 * - eventName: Name of the event in the smart contract ABI.
 * - args: Address-related arguments used to filter logs (e.g., recipient, origin).
 * - getEventType: Function to determine a custom "event type" (e.g., transferTo, transferFrom) based on the log contents and the user's address.
 */
type EventConfig = {
  eventName: string;
  args: Record<string, string | bigint>;
  getEventType: (log: any, userAddress: string) => string;
};

/**
 * Hook to retrieve smart wallet transactions by querying logs from the LedgerVault contract.
 * It also manages live updates when new events are detected in real time.
 */
export default function useGetCampaings() {
  const sessionData = useSelector((state: any) => state.auth.session);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const eventConfigs: EventConfig[] = [
    {
      eventName: 'CampaignRegistered',
      args: { owner: sessionData?.address || '' },
      getEventType: () => 'CampaignRegistered',
    },
  ];

  /**
   *  Helper function to create the event signature needed by viem's parseAbiItem().
   *    For example, an event signature looks like "event FundsTransferred(address indexed origin, address indexed recipient, ...)".
   */
  const createEventSignature = (event: any): string => {
    if (!event || !event.name || !event.inputs) {
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
    const eventAbi = CampaignRegistryAbi.abi.find(
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
          address: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS as Address,
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

      setCampaigns(logsWithDetails as any)
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { campaigns, fetchLogs, loading, error };
}
