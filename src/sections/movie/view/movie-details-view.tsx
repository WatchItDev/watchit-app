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
// _mock
import { productMock, moviesMock } from 'src/_mock';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

//
import MovieDetailMain from 'src/components/carousel/variants/movie-detail-main';
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import MovieDetailsReview from '../movie-details-review';
import MovieDetailsDescription from '../movie-details-description';
import Label from '../../../components/label';
import Header from '../../../layouts/dashboard/header';
import { useResponsive } from '../../../hooks/use-responsive';
import { useRouter,useParams  } from '../../../routes/hooks';
import { Poster } from '../../../components/poster/types';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MovieDetailsView({ id }: Props) {
  const product = productMock
  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();
  const pathname = useParams()

  const [currentTab, setCurrentTab] = useState('suggestions');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleBack = () => {
    router.push(paths.dashboard.root);
  }

  const renderProduct = product && (
    <>
      <Box sx={{width:"100%"}}>
        <MovieDetailMain movie={moviesMock.find(x=> x.id === pathname?.id) ?? {} as Poster} />
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
                value: 'reviews',
                label: `Reviews (${product.reviews.length})`,
              },
            ].map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {currentTab === 'suggestions' && (
            <MovieDetailsDescription description={product?.description} />
          )}

          {currentTab === 'reviews' && (
            <MovieDetailsReview
              ratings={product.ratings}
              reviews={product.reviews as any}
              totalRatings={product.totalRatings}
              totalReviews={product.totalReviews}
            />
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
            <Tooltip title="Go Live">
              <IconButton component={RouterLink} href="#">
                <Iconify icon="eva:external-link-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton component={RouterLink} href="#">
                <Iconify icon="solar:pen-bold" />
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
            <Typography sx={{ ml: 1 }} variant='subtitle2'>Esc</Typography>
          </IconButton>


          {mdUp && <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>⌘K</Label>}
        </Button>
        <Typography variant="h6" sx={{ ml: 2 }}>
          Movie details
        </Typography>
      </Header>
      <Stack direction="column" spacing={1}>
        {product && renderProduct}
      </Stack>
    </>
  );
}
