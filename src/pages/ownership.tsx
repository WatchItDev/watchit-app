import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { useSettingsContext } from '@src/components/settings';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import Typography from '@mui/material/Typography';
import Label from '@src/components/label';
import Container from '@mui/material/Container';
import MovieNewWizard from '@src/sections/movie/movie-new-wizard.tsx';

// ----------------------------------------------------------------------

const OwnershipView = () => {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <MovieNewEditForm /> */}
      <MovieNewWizard />
    </Container>
  )
}

export default function FileManagerPage() {
  const mdUp = useResponsive('up', 'md');

  const handleBack = () => {}

  return (
    <OgMetaTags
      title="Watchit: Ownership (COMING SOON)"
      description="Manage digital rights, track licensing, and unlock the power of decentralized ownership."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/ownership/`}
    >
      <Header>
        <HeaderContent title="Ownership" />
      </Header>
      <Header>
        <Button
          onClick={handleBack} disableFocusRipple
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#24262A',
            borderRadius: 1.5,
            m: 1,
            p: 0.2,
            '&:hover': {
              backgroundColor: '#1E1F22'
            }
          }}
        >
          <IconButton disableRipple>
            <IconChevronLeft size={20} />
            <Typography sx={{ ml: 1 }} variant='subtitle2'>Back</Typography>
          </IconButton>


          {mdUp && <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>Esc</Label>}
        </Button>
        <Typography variant="h6" sx={{ ml: 2 }}>
          New movie
        </Typography>
      </Header>
      <OwnershipView></OwnershipView>
    </OgMetaTags>
  );
}
