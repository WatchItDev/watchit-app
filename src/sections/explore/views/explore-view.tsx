import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ExploreGrid from '../components/explore-grid';
import GlassDefs from '../components/glass-defs';

export default function ExploreView() {
  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important', height: 'calc(100vh - 4rem)', maxHeight: 'calc(100vh - 4rem)' }}>
      <GlassDefs />
      <Stack direction="column" sx={{ maxWidth: '100vw !important', position: 'relative', height: '100%', maxHeight: '100%' }}>
        <ExploreGrid />
      </Stack>
    </Container>
  );
}
