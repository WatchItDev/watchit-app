import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ExploreGridSliderPlaceholderProps } from '@src/sections/explore/types';

/**
 * Simple colourful block used when slider content is unavailable.
 */
export default function ExploreGridSliderPlaceholder({ label = 'Slider' }: ExploreGridSliderPlaceholderProps) {
  return (
    <Box sx={{ height: '100%', borderRadius: 2, display: 'grid', placeItems: 'center', fontWeight: 700, userSelect: 'none', background: 'linear-gradient(135deg, rgba(75,0,130,0.9), rgba(0,212,255,0.9))' }}>
      <Typography variant="h4" sx={{ color: '#fff' }}>{label}</Typography>
    </Box>
  );
}
