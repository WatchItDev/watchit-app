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
import { useGetUsersQuery } from '@src/graphql/generated/hooks.tsx';
// import { useMigrateLensUsers } from '@src/hooks/use-migrate-lens-users.ts';

// ----------------------------------------------------------------------

const ExploreView = () => {
  const { data } = useGetUsersQuery({ fetchPolicy: 'network-only', variables: { limit: 300 } })

  console.log('ExploreView data: ', data);

  // const { done, max, errors, loadingBatch, finished } = useMigrateLensUsers();
  // return (
  //   <main style={{ padding: 32 }}>
  //     <h1>Migración Lens → Watchit</h1>
  //     <p>
  //       Procesados: {done}/{max} {finished && '✅ Completado'}
  //     </p>
  //     {loadingBatch && !finished && <p>⏳ Migrando lote…</p>}
  //     {!!errors.length && (
  //       <details style={{ marginTop: 16 }}>
  //         <summary>Errores ({errors.length})</summary>
  //         <pre style={{ whiteSpace: 'pre-wrap' }}>{errors.join('\n')}</pre>
  //       </details>
  //     )}
  //   </main>
  // );
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
