// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useCountdownDate } from '@src/hooks/use-countdown';
// assets
import { ComingSoonIllustration } from '@src/assets/illustrations';
import HeaderContent from "@src/layouts/dashboard/HeaderContent.tsx";
import Header from "@src/layouts/dashboard/header.tsx";

// ----------------------------------------------------------------------

interface props {
  deadline?: string
  showDeadline?: boolean
}

export const ComingSoonView = ({ deadline = '01/12/2025 21:30', showDeadline }: props) => {
  const { days, hours, minutes, seconds } = useCountdownDate(new Date(deadline));

  return (
    <>
      <Header>
        <HeaderContent title="Coming soon" />
      </Header>
      <Typography variant="h3" sx={{ mb: 2, mt: 3, width: '100%', textAlign: 'center' }}>
        Coming Soon!
      </Typography>

      <Typography variant={'h6'} sx={{ color: 'text.secondary', width: '100%', textAlign: 'center', mb: 1 }}>
        We are currently working hard on this page!
      </Typography>

      <ComingSoonIllustration sx={{ my: 10, height: 240 }} />

      {showDeadline && (
        <Stack
          direction="row"
          justifyContent="center"
          divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
          sx={{ typography: 'h2', mb: 4 }}
        >
          <TimeBlock label="Days" value={days} />

          <TimeBlock label="Hours" value={hours} />

          <TimeBlock label="Minutes" value={minutes} />

          <TimeBlock label="Seconds" value={seconds} />
        </Stack>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type TimeBlockProps = {
  label: string;
  value: string;
};

function TimeBlock({ label, value }: TimeBlockProps) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}

export default ComingSoonView;
