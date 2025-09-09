import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AiLoader from './ai-loader.tsx';

export default function ProcessingOverlay({ open, label = 'Finding something for your vibe…' }: { open: boolean; label?: string }) {
  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: (t) => t.zIndex.modal + 1 }}>
      <Stack spacing={1.5} alignItems="center">
        <Tooltip title="Personalizing based on your mood, time and tastes">
          <div>
            <AiLoader />
          </div>
        </Tooltip>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>{label}</Typography>
      </Stack>
    </Backdrop>
  );
}
