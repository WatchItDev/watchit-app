import { FC, useMemo, useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import {
  useClaimPerkMutation,
  useGetUnlockedPerksQuery,
} from '@src/graphql/generated/hooks.tsx';
import { useAuth } from '@src/hooks/use-auth';
import PerksItem from '@src/sections/achievements/components/perk-item.tsx';
import { UnlockedPerkState } from '@src/graphql/generated/graphql.ts';
import { useStaleWhileLoading } from '@src/hooks/use-stale-while-loading.ts';

const INITIAL_VISIBLE = 6;
const STEP = 3;

const PerksList: FC = () => {
  const { session } = useAuth();
  const address = session?.user?.address ?? '';
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const raw = useGetUnlockedPerksQuery({
    variables: { address, limit: 50 },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    pollInterval: 2000,
  });

  const { data, isInitialLoad, isRefetch } = useStaleWhileLoading(raw);
  const [claimPerk] = useClaimPerkMutation();
  const challenges = useMemo(() => {
    const states: UnlockedPerkState[] = data?.getUnlockedPerks ?? [];
    const parseReward = (txt: string) =>
      parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;

    return states
      .filter((s) => s.status !== 'CLAIMED')
      .map((s) => {
        const { perk, progress, target, status } = s;
        const pct =
          status === 'AVAILABLE'
            ? 100
            : target > 0
              ? Math.min(100, Math.floor((progress / target) * 100))
              : 0;

        return {
          id: perk.id,
          label: perk.name,
          rewardPreview: perk.rewardPreview,
          rewardAmt: parseReward(perk.rewardPreview),
          value: pct,
          canClaim: status === 'AVAILABLE',
        };
      })
      .sort((a, b) => {
        if (a.canClaim && !b.canClaim) return -1;
        if (!a.canClaim && b.canClaim) return 1;
        if (a.canClaim) return a.rewardAmt - b.rewardAmt;
        return b.value - a.value;
      });
  }, [data]);

  const handleClaim = useCallback(
    async (perkId: string) => {
      const perk = challenges.find((p) => p.id === perkId);
      if (!perk) return;

      try {
        setActiveId(perkId);
        await claimPerk({ variables: { perkId } });
      } catch (e) {
        console.error(e);
      } finally {
        setActiveId(null);
      }
    },
    [claimPerk, challenges],
  );

  const remaining = Math.max(0, challenges.length - visible);
  const showMore = () =>
    setVisible((v) => Math.min(challenges.length, v + STEP));
  const showLess = () => setVisible(INITIAL_VISIBLE);

  return (
    <Card>
      <CardHeader title="Perks" sx={{ px: 0 }} />

      <CardContent sx={{ pt: 2, px: 0 }}>
        {isInitialLoad &&
          !data &&
          [...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={36}
              sx={{ mb: 1 }}
            />
          ))}

        {challenges
          .slice(0, visible)
          .map(({ id, label, value, rewardPreview, canClaim }) => {
            const isThisLoading = activeId === id;

            return (
              <PerksItem
                key={id}
                id={id}
                value={value}
                handleClaim={handleClaim}
                canClaim={canClaim}
                label={label}
                rewardPreview={rewardPreview}
                isThisLoading={isThisLoading}
              />
            );
          })}

        {challenges.length === 0 && !isInitialLoad && (
          <Typography variant="body2" sx={{ pl: 2 }}>
            No challenges yet
          </Typography>
        )}

        {(!isInitialLoad || isRefetch) && (
          <Box textAlign="center" mt={1}>
            {remaining > 0 ? (
              <Button size="small" onClick={showMore}>
                Show {Math.min(STEP, remaining)} more perk
                {Math.min(STEP, remaining) > 1 ? 's' : ''}
              </Button>
            ) : challenges.length > INITIAL_VISIBLE ? (
              <Button size="small" onClick={showLess}>
                Show less
              </Button>
            ) : null}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PerksList;
