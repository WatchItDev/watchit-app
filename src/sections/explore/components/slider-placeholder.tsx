import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SliderPlaceholder({ label = 'Slider' }: { label?: string }) {
  return (
    <Box sx={{ height: '100%', borderRadius: 2, display: 'grid', placeItems: 'center', fontWeight: 700, userSelect: 'none', background: 'linear-gradient(135deg, rgba(75,0,130,0.9), rgba(0,212,255,0.9))' }}>
      <Typography variant="h4" sx={{ color: '#fff' }}>{label}</Typography>
    </Box>
  );
}
