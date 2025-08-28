import { FC } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { m } from 'framer-motion';
import { paths } from '@src/routes/paths.ts';
import { useAuth } from '@src/hooks/use-auth';
import { useRouter } from '@src/routes/hooks';
import { varHover } from '@src/components/animate';
import AvatarProfile from '@src/components/avatar/avatar';
import { useGetAchievementsQuery } from '@src/graphql/generated/hooks.tsx';
import { useStaleWhileLoading } from '@src/hooks/use-stale-while-loading.ts';

export const UserSidebarProfile: FC = () => {
  const router = useRouter();
  const { session } = useAuth();
  const address = session?.user?.address ?? '';
  const raw = useGetAchievementsQuery({
    variables: { address },
    fetchPolicy: 'network-only',
  });
  const { data: achData } = useStaleWhileLoading(raw);
  const xpBalance = session?.user?.xpBalance ?? 0;

  const currentRank = achData?.getAchievements.currentRank;
  const nextRank = achData?.getAchievements.nextRank;
  const progress = nextRank
    ? Math.min(100, (xpBalance / nextRank.minXp) * 100)
    : 100;

  return (
    <>
      <Box display="flex" justifyContent="center" mb={2}>
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={() => {
            router.push(paths.dashboard.user.root(`${session?.user?.address}`));
          }}
          sx={{
            width: 132,
            height: 132,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }}
        >
          <AvatarProfile
            src={
              (session?.user?.profilePicture || session?.user?.address) ?? ''
            }
            alt={session?.user?.displayName || address}
            sx={{
              width: 128,
              height: 128,
              border: 'solid 4px #161C24',
            }}
          />
        </IconButton>
      </Box>

      {/* Achievements summary */}
      {currentRank && (
        <Card variant="outlined" sx={{ mb: 3, px: 2, py: 1.5 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            mb={1}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {currentRank.name}
            </Typography>
            {nextRank && (
              <Typography variant="subtitle2" color="text.secondary">
                →
              </Typography>
            )}
            {nextRank && (
              <Typography variant="subtitle2" color="text.secondary">
                {nextRank.name}
              </Typography>
            )}
          </Box>

          <Box mt={2}>
            <ProgressBar value={progress} variant="determinate" />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                {progress.toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {xpBalance.toLocaleString()} XP /{' '}
                {nextRank ? nextRank.minXp : currentRank.minXp} XP
              </Typography>
            </Box>
          </Box>
        </Card>
      )}
    </>
  );
};

export default UserSidebarProfile;

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[800],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));
