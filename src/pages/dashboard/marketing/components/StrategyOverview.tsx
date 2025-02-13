import Grid from '@mui/material/Grid';

import { generateRandomData } from '@src/sections/marketing/fakeData';
import { StrategyType } from '@src/types/marketing';
import Container from '@mui/material/Container';
import CampaignCreate from '@src/sections/marketing/components/CampaignCreate.tsx';
import CampaignTable from '@src/sections/marketing/components/CampaignTable';

const StrategyOverview = () => {
  const strategy: StrategyType[] = generateRandomData(1);

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
        <CampaignTable strategy={strategy[0]} key={`key-table-strategy-campaigns`} />
      </Grid>
    </Container>
  );
};

export default StrategyOverview;
