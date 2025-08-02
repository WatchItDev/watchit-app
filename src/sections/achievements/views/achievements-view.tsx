import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import UserSidebar from '@src/sections/achievements/components/user-sidebar.tsx';
import PerksList from '@src/sections/achievements/components/perks-list.tsx';
import LeaderboardTable from '@src/sections/achievements/components/leaderboard-table.tsx';
import DailyRewards from '@src/sections/achievements/components/daily-rewards.tsx';

export default function AchievementsView() {
  const theme = useTheme();

  return (
    <Container maxWidth={false}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid
          xs={12}
          md={3}
          sx={{
            pr: { md: 2 },
            borderRight: {
              md: `1px dashed ${theme.palette.divider}`,
            },
          }}
        >
          <UserSidebar />
        </Grid>

        {/* Centre */}
        <Grid
          xs={12}
          md={6}
          sx={{
            px: { md: 2 },
            borderRight: {
              md: `1px dashed ${theme.palette.divider}`,
            },
          }}
        >
          <PerksList />
          <LeaderboardTable />
        </Grid>

        {/* Right */}
        <Grid xs={12} md={3} sx={{ p: 0 }}>
          <DailyRewards />
        </Grid>
      </Grid>
    </Container>
  );
}
