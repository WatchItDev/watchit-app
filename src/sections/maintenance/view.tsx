// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// assets
import { MaintenanceIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function MaintenanceView() {
  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Website currently under maintenance
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        We are currently working hard on this page!
      </Typography>

      <MaintenanceIllustration sx={{ my: 10, height: 240 }} />

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to Home
      </Button>
    </Stack>
  );
}
