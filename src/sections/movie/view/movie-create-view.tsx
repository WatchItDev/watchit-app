// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
//
import MovieNewWizard from '../movie-new-wizard';

// ----------------------------------------------------------------------

export default function MovieCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <MovieNewEditForm /> */}
      <MovieNewWizard />
    </Container>
  );
}
