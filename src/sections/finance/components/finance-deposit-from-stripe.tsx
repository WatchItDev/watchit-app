// @mui
import Box from '@mui/material/Box';

// Project components
import TextMaxLine from '@src/components/text-max-line';
import { ComingSoonIllustration } from '@src/assets/illustrations';

const FinanceDepositFromStripe = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 2,
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <ComingSoonIllustration sx={{ mt: 0, mb: 1, height: 120 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            textAlign: 'center',
          }}
        >
          <TextMaxLine variant={'h5'} line={1}>
            This feature is coming soon.
          </TextMaxLine>
          <TextMaxLine color={'text.secondary'} variant={'body2'} line={2} sx={{ mb: 2 }}>
            We’re working hard to bring this feature to life.
            <br /> Check back soon!
          </TextMaxLine>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceDepositFromStripe;
