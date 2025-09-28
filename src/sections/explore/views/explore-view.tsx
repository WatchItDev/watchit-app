import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { WatchitWidget } from '@src/components/ai-widget';
import ExploreGrid from '../components/explore-grid';

/**
 * Top-level explore route aggregating the grid and floating widget.
 */
export default function ExploreView() {
  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack direction="column" sx={{ maxWidth: '100vw !important', position: 'relative' }}>
        <ExploreGrid />
      </Stack>
      <WatchitWidget />
    </Container>
  );
}
