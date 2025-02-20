import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CampaignCreate from '@src/sections/marketing/components/CampaignCreate.tsx';
import CampaignTable from '@src/sections/marketing/components/CampaignTable';

const StrategyOverview = () => {
  return (
    <Container
      sx={{
        marginTop: { xs: '1rem', md: '2rem' },
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
      <Grid container spacing={1} justifyContent={'flex-end'} alignItems="center" gap={1}>
        <CampaignCreate />
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{
          mt: 1,
        }}
      >
        <CampaignTable />
      </Grid>
    </Container>
  );
};

export default StrategyOverview;
