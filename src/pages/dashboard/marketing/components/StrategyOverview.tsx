import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { generateRandomData } from '@src/sections/marketing/fakeData';
import { StrategyType } from '@src/types/marketing';
import Container from '@mui/material/Container';
import StrategyItem from '@src/sections/marketing/components/StrategyItem.tsx';
import CampaignCreate from '@src/sections/marketing/components/CampaignCreate.tsx';
import Iconify from '@src/components/iconify';
import { COLORS } from '@src/layouts/config-layout.ts';

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
        <Button
          variant="contained"
          sx={{
            background: COLORS.GRAY_LIGHT,
            color: 'white',
            p: '3px',
            '&:hover': {
              color: COLORS.GRAY_LIGHT,
            },
          }}
        >
          <Iconify icon={'iconoir:pause'} width={32} />
        </Button>
        <CampaignCreate />
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{
          mt: 1,
        }}
      >
        <StrategyItem strategy={strategy[0]} index={0} key={`key-some-strategy`} />
      </Grid>
    </Container>
  );
};

export default StrategyOverview;
