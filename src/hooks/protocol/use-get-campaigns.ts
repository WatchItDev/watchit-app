import { useState } from 'react';
import { parseAbiItem, formatUnits, Address } from 'viem';

import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { CampaignLog } from '@src/hooks/protocol/types.ts';

const CAMPAIGN_BLOCK_LOOKBACK = 120_000n;

export default function useGetCampaigns() {
  const { session: sessionData } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const events = [
    {
      eventName: 'CampaignRegistered',
      args: { owner: sessionData?.address || '' },
      getEventType: () => 'CampaignRegistered',
    },
  ];

  const createEventSignature = (event: any): string => {
    if (!event?.name || !event.inputs) throw new Error('Invalid event in ABI');
    const inputs = event.inputs
      .map(
        (input: any) =>
          `${input.type}${input.indexed ? ' indexed' : ''} ${input.name}`,
      )
      .join(', ');
    return `event ${event.name}(${inputs})`;
  };

  const uniqueEventNames = Array.from(new Set(events.map((c) => c.eventName)));
  const parsedAbis = uniqueEventNames.reduce(
    (acc, eventName) => {
      const evt = CampaignRegistryAbi.abi.find(
        (i: any) => i.type === 'event' && i.name === eventName,
      );
      if (!evt) throw new Error(`No definition for event ${eventName} in ABI`);
      acc[eventName] = parseAbiItem(createEventSignature(evt));
      return acc;
    },
    {} as Record<string, ReturnType<typeof parseAbiItem>>,
  );

  const fetchCampaigns = async (
    blockLookback: bigint = CAMPAIGN_BLOCK_LOOKBACK,
  ) => {
    if (!sessionData?.address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const latestBlock = await publicClient.getBlockNumber();
      const fromBlock =
        latestBlock > blockLookback ? latestBlock - blockLookback : 0n;

      const promises = events.map(({ eventName, args }) =>
        publicClient.getLogs({
          address: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS as Address,
          event: parsedAbis[eventName] as any,
          args,
          fromBlock,
          toBlock: 'latest',
        }),
      );
      const results = await Promise.all(promises);
      const allLogs = results.flat();
      const logsWithDetails = await Promise.all(
        allLogs.map(async (log: any) => {
          const block = await publicClient.getBlock({
            blockNumber: log.blockNumber,
          });
          const cfg = events.find((c) => c.eventName === log.eventName);
          return {
            ...log,
            timestamp: block.timestamp,
            readableDate: new Date(
              Number(block.timestamp) * 1000,
            ).toLocaleString(),
            formattedAmount: log.args.amount
              ? formatUnits(log.args.amount, 18)
              : '0',
            event: cfg ? cfg.getEventType(log) : 'unknown',
          } as CampaignLog;
        }),
      );

      logsWithDetails.sort((a, b) => {
        const byBlock = Number(b.blockNumber) - Number(a.blockNumber);
        return byBlock !== 0
          ? byBlock
          : Number(b.transactionIndex) - Number(a.transactionIndex);
      });

      setCampaigns(logsWithDetails);
    } catch (err) {
      console.error('Error fetching campaign logs:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {
    campaigns,
    fetchLogs: fetchCampaigns,
    loading,
    error,
  };
}
