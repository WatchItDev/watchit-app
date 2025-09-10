import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { useSettingsContext } from '@src/components/settings';
import Container from '@mui/material/Container';
import MovieNewWizard from '@src/sections/movie/movie-new-wizard.tsx';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  const settings = useSettingsContext();

  const handleBack = () => {}

  return (
    <OgMetaTags
      title="Watchit: Ownership (COMING SOON)"
      description="Manage digital rights, track licensing, and unlock the power of decentralized ownership."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/ownership/`}
    >
      <Header>
        <HeaderContent handleBack={handleBack} title="New content" />
      </Header>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <MovieNewWizard />
      </Container>
    </OgMetaTags>
  );
}
