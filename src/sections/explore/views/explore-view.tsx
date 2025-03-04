// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// LOCAL IMPORTS
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { ExploreCreators } from '@src/sections/explore/components/explore-creators.tsx';
import { ExploreBookmarks } from '@src/sections/explore/components/explore-bookmarks.tsx';
import { ExplorePublications } from '@src/sections/explore/components/explore-publications.tsx';
import { ExploreTopPublications } from '@src/sections/explore/components/explore-top-publications.tsx';

// ----------------------------------------------------------------------

const ExploreView = () => {
  const { isAuthenticated } = useAccountSession();

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack direction={'column'} spacing={1} sx={{ maxWidth: '100vw !important' }}>
        <ExploreTopPublications />

        {isAuthenticated() && (
          <ExploreBookmarks />
        )}

        <ExploreCreators />

        <ExplorePublications />
      </Stack>
    </Container>
  );
}

export default ExploreView;
