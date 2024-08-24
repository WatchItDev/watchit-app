// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import MovieNewEditForm from '../movie-new-edit-form';

// ----------------------------------------------------------------------

export default function MovieCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Movie',
            href: paths.dashboard.movie.root,
          },
          { name: 'New product' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MovieNewEditForm />
    </Container>
  );
}
