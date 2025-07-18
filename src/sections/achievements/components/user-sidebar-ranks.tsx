import { FC, useMemo } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { useAuth } from '@src/hooks/use-auth';
import {
  useGetAchievementsQuery,
  useGetRanksCatalogQuery,
} from '@src/graphql/generated/hooks.tsx';
import { m } from 'framer-motion';
import { varHover } from '@src/components/animate';
import { RANK_ICON } from '@src/utils/ranks.ts';
import { useStaleWhileLoading } from '@src/hooks/use-stale-while-loading.ts';

export const UserSidebarRanks: FC = () => {
  const { session } = useAuth();
  const address = session?.user?.address ?? '';
  const raw = useGetAchievementsQuery({
    variables: { address },
    fetchPolicy: 'network-only',
  });
  const { data: achData } = useStaleWhileLoading(raw);
  const rawRanks = useGetRanksCatalogQuery({
    fetchPolicy: 'network-only',
  });
  const { data: ranksData, loading: ranksLoading } = useStaleWhileLoading(rawRanks);

  const currentRankId = achData?.getAchievements.currentRank.id ?? 'watcher';

  const rankRows = useMemo(() => {
    const rows = ranksData?.getRanksCatalog ?? [];
    return [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [ranksData?.getRanksCatalog]);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(4, 1fr)"
      gap={2}
      justifyItems="center"
      mb={3}
    >
      {ranksLoading &&
        [...Array(8)].map((_, i) => (
          <Skeleton key={i} variant="circular" width={45} height={45} />
        ))}

      {!ranksLoading &&
        rankRows.map((r) => {
          const isUnlocked =
            r.id === currentRankId ||
            r.order < (achData?.getAchievements.currentRank.order ?? 0);

          return (
            <Tooltip key={r.id} title={isUnlocked ? r.name : `${r.name} unlocks with ${r.minXp}XP`} arrow>
              <IconButton
                component={m.button}
                whileHover="hover"
                whileTap="tap"
                variants={varHover(1.05)}
                sx={{
                  p: 0,
                  width: 50,
                  height: 50,
                }}
              >
                <RankIcon
                  src={RANK_ICON[r.id] ?? RANK_ICON['watcher']}
                  alt={r.name}
                  sx={{
                    opacity: isUnlocked ? 1 : 0.35,
                    filter: isUnlocked ? 'none' : 'grayscale(1)',
                  }}
                />
              </IconButton>
            </Tooltip>
          );
        })}
    </Box>
  );
};

export default UserSidebarRanks;

const RankIcon = styled('img')({
  width: '50px !important',
  minWidth: '50px !important',
  height: '50px !important',
  minHeight: '50px !important',
  flexShrink: 0
});
