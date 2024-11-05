import { useCallback, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// routes
import { paths } from '@src/routes/paths';
import { RouterLink } from '@src/routes/components';
// components
import Iconify from '@src/components/iconify';
import { useSettingsContext } from '@src/components/settings';

//
import MovieDetailMain from '@src/components/carousel/variants/movie-detail-main';
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePublication } from '@lens-protocol/react';
import MovieDetailsComments from '../movie-details-comments';
import MovieDetailsDescription from '../movie-details-description';
import Label from '../../../components/label';
import Header from '../../../layouts/dashboard/header';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { useRouter } from '@src/routes/hooks';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MovieDetailsView({ id }: Props) {
  const [currentTab, setCurrentTab] = useState('suggestions');

  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();
  const { data, loading }: any = usePublication({
    forId: id as any,
  });

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleBack = () => {
    router.push(paths.dashboard.root);
  }

  if (loading) return <LoadingScreen />

  const renderProduct = data && (
    <>
      <Box sx={{width:"100%"}}>
        <MovieDetailMain post={data} />
      </Box>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 3,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {[
              {
                value: 'suggestions',
                label: 'Suggestions'
              },
              {
                value: 'comments',
                label: `Comments (${data?.stats?.comments})`,
              },
            ].map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {currentTab === 'suggestions' && (
            <MovieDetailsDescription description={data.metadata?.content} />
          )}

           {currentTab === 'comments' && (
            <MovieDetailsComments id={id} />
           )}

          {/* {currentTab === 'Discussions' && ( */}
          {/*  <MovieDetailsDiscussion/> */}
          {/* )} */}
        </Card>
      </Container>
    </>
  );

  return (
    <>
      <Header
        actions={(
          <Box>
            <Tooltip title="Share">
              <IconButton component={RouterLink} href="#">
                <Iconify icon="eva:external-link-fill" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      >
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
          Movie details
        </Typography>
      </Header>
      <Stack direction="column" spacing={1}>
        {data && renderProduct}
      </Stack>
    </>
  );
}
