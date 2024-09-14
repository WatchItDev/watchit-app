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
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
// _mock
import { _mock, productMock } from 'src/_mock';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { m } from 'framer-motion';
//
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import MovieDetailsReview from '../movie-details-review';
import MovieDetailsDescription from '../movie-details-description';
import { MotionContainer, varFade } from '../../../components/animate';
import Image from '../../../components/image';
import { bgGradient } from '../../../theme/css';
import Label from '../../../components/label';
import Header from '../../../layouts/dashboard/header';
import { useResponsive } from '../../../hooks/use-responsive';
import { useRouter } from '../../../routes/hooks';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MovieDetailsView({ id }: Props) {
  const product = productMock

  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState('suggestions');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleBack = () => {
    router.push(paths.dashboard.root);
  }

  const renderProduct = product && (
    <>
      <Paper sx={{ position: 'relative', boxShadow: 'none' }}>
        <Image dir="ltr" alt="Edge of Tomorrow" src={_mock.image.cover(1)} ratio="21/9" />

        <Box
          sx={{
            top: 0,
            width: 1,
            height: 1,
            position: 'absolute',
            ...bgGradient({
              direction: 'to top',
              startColor: `#1E1F22 0%`,
              endColor: `${alpha('#1E1F22', 0)} 100%`,
            }),
          }}
        />
        <Container>
          <CardContent
            component={MotionContainer}
            animate
            action
            sx={{
              left: '50px',
              bottom: 50,
              maxWidth: '50%',
              p: '0 !important',
              textAlign: 'left',
              position: 'absolute',
              color: 'common.white',
            }}
          >
            <m.div variants={varFade().inLeft}>
              <Typography variant="h3" gutterBottom>
                Test
              </Typography>
            </m.div>

            <m.div variants={varFade().inLeft}>
              <Typography variant="body2" noWrap gutterBottom>
                In the not-too-distant future, a race of aliens invades Earth and no military force is capable of stopping it. Commander William Cage, who has never seen combat, is tasked with an almost suicidal mission in which he loses his life. He then enters a time loop in which he relives the battle and his death over and over again. The multiple battles he fights make him increasingly skilled in his fight against...
              </Typography>
            </m.div>

            <m.div variants={varFade().inLeft}>
              <Button variant="contained" sx={{ mt: 3 }}>
                View More
              </Button>
            </m.div>
          </CardContent>
        </Container>
      </Paper>

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
              label: 'Suggestions',
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
      </Card>
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
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {product && renderProduct}
      </Container>
    </>
  );
}
