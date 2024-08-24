import { useEffect, useCallback, useState } from 'react';
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
import { _mock, PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// api
import { useGetProduct } from 'src/api/product';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { m } from 'framer-motion';
//
import { ProductDetailsSkeleton } from '../movie-skeleton';
import MovieDetailsReview from '../movie-details-review';
import MovieDetailsToolbar from '../movie-details-toolbar';
import MovieDetailsDescription from '../movie-details-description';
import { MotionContainer, varFade } from '../../../components/animate';
import Image from '../../../components/image';
import { bgGradient } from '../../../theme/css';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MovieDetailsView({ id }: Props) {
  const { product, productLoading, productError } = useGetProduct(id);

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('description');

  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (product) {
      setPublish(product?.publish);
    }
  }, [product]);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${productError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.movie.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = product && (
    <>
      <MovieDetailsToolbar
        backLink={paths.dashboard.movie.root}
        editLink={paths.dashboard.movie.edit(`${product?.id}`)}
        liveLink={paths.movie.details(`${product?.id}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

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
            reviews={product.reviews}
            totalRatings={product.totalRatings}
            totalReviews={product.totalReviews}
          />
        )}
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {productLoading && renderSkeleton}

      {productError && renderError}

      {product && renderProduct}
    </Container>
  );
}
