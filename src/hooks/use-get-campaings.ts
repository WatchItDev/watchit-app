import { useState } from 'react';
import { useSelector } from 'react-redux';
import { parseAbiItem, formatUnits, Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';

export default function useGetCampaings() {
  const sessionData = useSelector((state: any) => state.auth.session);
  const [campaigns, setCampaigns] = useState([]);
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
    if (!event || !event.name || !event.inputs) {
      throw new Error('Invalid event in ABI');
    }
    const inputs = event.inputs
      .map((input: any) => `${input.type}${input.indexed ? ' indexed' : ''} ${input.name}`)
      .join(', ');
    return `event ${event.name}(${inputs})`;
  };

  const uniqueEventNames = Array.from(
    new Set(events.map((config) => config.eventName)) // Removes duplicates
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

  const fetchCampaings = async () => {
    if (!sessionData?.address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const promises = events.map(({ eventName, args }) => {
        return publicClient.getLogs({
          address: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS as Address,
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
          const foundConfig = events.find((c) => c.eventName === log.eventName);
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

  return { campaigns, fetchLogs: fetchCampaings, loading, error };
}
