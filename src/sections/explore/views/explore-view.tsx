// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// LOCAL IMPORTS
import ExploreLoader from "@src/sections/explore/components/explore-loader.tsx"
import { ExploreCreators } from '@src/sections/explore/components/explore-creators.tsx';
import { ExploreBookmarks } from '@src/sections/explore/components/explore-bookmarks.tsx';
import { ExplorePublications } from '@src/sections/explore/components/explore-publications.tsx';
import { ExploreTopPublications } from '@src/sections/explore/components/explore-top-publications.tsx';
import { useSelector } from "react-redux"
import { RootState} from "@redux/store.ts"
import { isLoading } from "@src/utils/is-loading.ts"
import { useEffect } from "react"
import { useAuth } from '@src/hooks/use-auth.ts';

// ----------------------------------------------------------------------

const ExploreView = () => {
  const { isFullyAuthenticated: isAuthenticated } = useAuth();
  const loading = useSelector((state: RootState) => state.loading)
  const exploreIsLoading = isLoading(loading.explore);

  useEffect(() => {
    console.log('explore loading: ', exploreIsLoading);
  }, [exploreIsLoading])

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important'}}>
      <Stack direction={'column'} spacing={1} sx={{ maxWidth: '100vw !important',  position: 'relative' }}>
        {exploreIsLoading ? <ExploreLoader /> : null}
        <ExploreTopPublications />
        {isAuthenticated && (
          <ExploreBookmarks />
        )}
        <ExploreCreators />
        <ExplorePublications />
      </Stack>
    </Container>
  );
}

export default ExploreView;
