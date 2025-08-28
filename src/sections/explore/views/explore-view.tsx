// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// LOCAL IMPORTS
import ExplorePublications from '@src/sections/explore/components/explore-publications.tsx';
import { ExploreTopPublications } from '@src/sections/explore/components/explore-top-publications.tsx';

// ----------------------------------------------------------------------

const ExploreView = () => {
  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack
        direction={'column'}
        spacing={1}
        sx={{ maxWidth: '100vw !important', position: 'relative' }}
      >
        <ExploreTopPublications />
        <ExplorePublications />
      </Stack>
    </Container>
  );
};

export default ExploreView;
