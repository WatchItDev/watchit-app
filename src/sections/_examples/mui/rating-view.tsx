import { useState } from 'react';
// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Rating, { IconContainerProps } from '@mui/material/Rating';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const labels: { [index: string]: string } = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <Iconify icon="ic:round-sentiment-very-dissatisfied" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <Iconify icon="ic:round-sentiment-dissatisfied" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <Iconify icon="ic:round-sentiment-neutral" />,
    label: 'Neutral',
  },
  4: {
    icon: <Iconify icon="ic:round-sentiment-satisfied" />,
    label: 'Satisfied',
  },
  5: {
    icon: <Iconify icon="ic:round-sentiment-very-satisfied" />,
    label: 'Very Satisfied',
  },
};

// ----------------------------------------------------------------------

export default function RatingView() {
  const [value, setValue] = useState<number | null>(2);

  const [hover, setHover] = useState(-1);

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Rating"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Rating' },
            ]}
            moreLink={['https://mui.com/components/rating']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
          <ComponentBlock title="Controlled">
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </ComponentBlock>

          <ComponentBlock title="Read only">
            <Rating name="read-only" value={value} readOnly />
          </ComponentBlock>

          <ComponentBlock title="Disabled">
            <Rating name="disabled" value={value} disabled />
          </ComponentBlock>

          <ComponentBlock title="Pristine">
            <Rating name="pristine" value={null} />
          </ComponentBlock>

          <ComponentBlock title="Custom empty icon">
            <Rating name="customized-empty" defaultValue={2} precision={0.5} />
          </ComponentBlock>

          <ComponentBlock title="Custom icon and color">
            <Rating
              name="customized-color"
              defaultValue={2}
              getLabelText={(ratingValue) => `${ratingValue} Heart${ratingValue !== 1 ? 's' : ''}`}
              precision={0.5}
              icon={<Iconify icon="solar:heart-bold" />}
              emptyIcon={<Iconify icon="solar:heart-bold" />}
              sx={{
                color: 'info.main',
                '&:hover': { color: 'info.dark' },
              }}
            />
          </ComponentBlock>

          <ComponentBlock title="10 stars">
            <Rating name="customized-10" defaultValue={2} max={10} />
          </ComponentBlock>

          <ComponentBlock title="Custom icon set">
            <Rating
              name="customized-icons"
              defaultValue={2}
              getLabelText={(ratingValue) => customIcons[ratingValue].label}
              IconContainerComponent={IconContainer}
            />
          </ComponentBlock>

          <ComponentBlock title="Hover feedback">
            <Rating
              name="hover-feedback"
              value={value}
              precision={0.5}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
            />
            {value !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>}
          </ComponentBlock>

          <ComponentBlock title="Half ratings">
            <Rating name="half-rating" defaultValue={2.5} precision={0.5} />

            <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
          </ComponentBlock>

          <ComponentBlock title="Sizes">
            <Rating name="size-small" defaultValue={2} size="small" />

            <Rating name="size-medium" defaultValue={2} />

            <Rating name="size-large" defaultValue={2} size="large" />
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;

  return <span {...other}>{customIcons[value].icon}</span>;
}
