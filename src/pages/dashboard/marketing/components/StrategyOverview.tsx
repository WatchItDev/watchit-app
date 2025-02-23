import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CampaignCreate from '@src/sections/marketing/components/CampaignCreate.tsx';
import CampaignTable from '@src/sections/marketing/components/CampaignTable';
import { useEffect } from 'react';
import useGetCampaings from '@src/hooks/protocol/use-get-campaings.ts';

const StrategyOverview = () => {
  const { campaigns, loading, fetchLogs } = useGetCampaings();

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefreshTable = () => {
    fetchLogs()
  };

  return (
    <Container
      sx={{
        marginTop: { xs: '1rem', md: '2rem' },
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
      <Grid container spacing={1} justifyContent={'flex-end'} alignItems="center" gap={1}>
        <CampaignCreate onSuccess={handleRefreshTable} />
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{
          mt: 1,
        }}
      >
        <CampaignTable
          campaigns={campaigns}
          loading={loading}
        />
      </Grid>
    </Container>
  );
};

export default StrategyOverview;
