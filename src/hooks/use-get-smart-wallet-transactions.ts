import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parseAbiItem, formatUnits, Address } from 'viem';
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

type EventConfig = {
  eventName: string;
  args: Record<string, string | bigint>;
  getEventType: (log: any, userAddress: string) => string;
};

export const useGetSmartWalletTransactions = () => {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);
  const blockchainEvents = useSelector((state: any) => state.blockchainEvents.events);
  const transactions = useSelector((state: any) => state.transactions.transactions);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const eventConfigs: EventConfig[] = [
    {
      eventName: 'FundsTransferred',
      args: { recipient: sessionData?.address || '' },
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
      eventName: 'FundsLocked',
      args: { account: sessionData?.address || '' },
      getEventType: () => 'locked',
    },
    {
      eventName: 'FundsClaimed',
      args: { claimer: sessionData?.address || '' },
      getEventType: () => 'claimed',
    },
    {
      eventName: 'FundsReserved',
      args: { from: sessionData?.address || '' },
      getEventType: () => 'reserved',
    },
    {
      eventName: 'FundsCollected',
      args: { from: sessionData?.address || '' },
      getEventType: () => 'collected',
    },
    {
      eventName: 'FundsReleased',
      args: { to: sessionData?.address || '' },
      getEventType: () => 'released',
    },
  ];

  const createEventSignature = (event: any): string => {
    if (!event || !event.name || !event.inputs) {
      throw new Error('Invalid event in ABI');
    }
    const inputs = event.inputs
      .map((input: any) => `${input.type}${input.indexed ? ' indexed' : ''} ${input.name}`)
      .join(', ');
    return `event ${event.name}(${inputs})`;
  };

  const uniqueEventNames = Array.from(
    new Set(eventConfigs.map((config) => config.eventName))
  );

  const parsedAbis = uniqueEventNames.reduce((acc, eventName) => {
    const eventAbi = LedgerVaultAbi.abi.find(
      (item: any) => item.type === 'event' && item.name === eventName
    );
    if (!eventAbi) {
      throw new Error(`The event is not fund ${eventName} on the ABI`);
    }
    acc[eventName] = parseAbiItem(createEventSignature(eventAbi));
    return acc;
  }, {} as Record<string, ReturnType<typeof parseAbiItem>>);

  const fetchLogs = async () => {
    if (!sessionData?.address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const promises = eventConfigs.map(({ eventName, args }) => {
        return publicClient.getLogs({
          address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS as Address,
          event: parsedAbis[eventName] as any,
          args,
          fromBlock: 0n,
          toBlock: 'latest',
        });
      });

      const results = await Promise.all(promises);

      const allLogs = results.flat();

      const logsWithDetails = await Promise.all(
        allLogs.map(async (log: any) => {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });

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

      const sortedLogs = logsWithDetails.sort((a, b) => {
        const blockDifference = Number(b.blockNumber) - Number(a.blockNumber);
        if (blockDifference !== 0) return blockDifference;
        return Number(b.transactionIndex) - Number(a.transactionIndex);
      });

      dispatch(setTransactions(sortedLogs));
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (transactions.length) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData?.address]);

  useEffect(() => {
    if (!blockchainEvents?.length) return;

    blockchainEvents.forEach(async (log: any) => {
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
  }, [blockchainEvents, sessionData?.address, dispatch, uniqueEventNames, eventConfigs]);

  return { transactions, loading, error };
}

export default useGetSmartWalletTransactions;
