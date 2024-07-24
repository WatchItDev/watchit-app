// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fData } from 'src/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  value: number;
  total: number;
  icon: string;
}

export default function FileWidget({ title, value, total, icon, sx, ...other }: Props) {
  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Box component="img" src={icon} sx={{ width: 48, height: 48 }} />

      <Typography variant="h6" sx={{ mt: 3 }}>
        {title}
      </Typography>

      <LinearProgress
        value={24}
        variant="determinate"
        color="inherit"
        sx={{
          my: 2,
          height: 6,
          '&::before': {
            bgcolor: 'divider',
            opacity: 1,
          },
        }}
      />

      <Stack
        direction="row"
        spacing={0.5}
        justifyContent="flex-end"
        sx={{ typography: 'subtitle2' }}
      >
        <Box
          sx={{
            mr: 0.5,
            typography: 'body2',
            color: 'text.disabled',
          }}
        >
          {fData(value)}
        </Box>

        {` / ${fData(total)}`}
      </Stack>
    </Card>
  );
}
