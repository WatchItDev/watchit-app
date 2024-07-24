// @mui
import { Variant } from '@mui/material/styles/createTypography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import { useTypography } from 'src/components/text-max-line';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const TYPOGRAPHYS = [
  { label: 'h1. Heading', variant: 'h1' },
  { label: 'h2. Heading', variant: 'h2' },
  { label: 'h3. Heading', variant: 'h3' },
  { label: 'h4. Heading', variant: 'h4' },
  { label: 'h5. Heading', variant: 'h5' },
  { label: 'h6. Heading', variant: 'h6' },
  {
    label:
      'subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur',
    variant: 'subtitle1',
  },
  {
    label:
      'subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur',
    variant: 'subtitle2',
  },
  {
    label:
      'body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.',
    variant: 'body1',
  },
  {
    label:
      'body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.',
    variant: 'body2',
  },
  { label: 'caption text', variant: 'caption' },
  { label: 'overline text', variant: 'overline' },
  { label: 'Button', variant: 'button' },
] as const;

// ----------------------------------------------------------------------

export default function TypographyView() {
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
            heading="Typography"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Typography' },
            ]}
            moreLink={['https://mui.com/components/typography']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Grid container rowSpacing={5}>
          <Grid xs={12} md={3}>
            <Typography variant="h6">Default Text</Typography>
          </Grid>

          <Grid xs={12} md={9}>
            <Stack spacing={3}>
              {TYPOGRAPHYS.map((font) => (
                <BlockVariant key={font.variant} font={font} />
              ))}
            </Stack>
          </Grid>

          <Grid xs={12} md={3}>
            <Typography variant="h6">Colors Text</Typography>
          </Grid>

          <Grid xs={12} md={9}>
            <Stack spacing={3}>
              {['primary', 'secondary', 'disabled'].map((color) => (
                <Paper key={color} variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
                  <Typography gutterBottom variant="subtitle1" sx={{ color: `text.${color}` }}>
                    text {color}
                  </Typography>

                  <Typography gutterBottom variant="body2" sx={{ color: `text.${color}` }}>
                    Cras ultricies mi eu turpis hendrerit fringilla. Fusce vel dui. Pellentesque
                    auctor neque nec urna. Sed cursus turpis vitae tortor. Curabitur suscipit
                    suscipit tellus.
                  </Typography>
                </Paper>
              ))}

              {['primary', 'secondary', 'info', 'warning', 'error'].map((color) => (
                <Paper key={color} variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
                  <Typography gutterBottom variant="subtitle1" sx={{ color: `${color}.main` }}>
                    {color}
                  </Typography>

                  <Typography gutterBottom variant="body2" sx={{ color: `${color}.main` }}>
                    Cras ultricies mi eu turpis hendrerit fringilla. Fusce vel dui. Pellentesque
                    auctor neque nec urna. Sed cursus turpis vitae tortor. Curabitur suscipit
                    suscipit tellus.
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

type BlockVariantProps = {
  font: {
    variant: Variant;
    label: string;
  };
};

function BlockVariant({ font }: BlockVariantProps) {
  const { variant, label } = font;

  const { fontSize, lineHeight, fontWeight, letterSpacing = 0 } = useTypography(variant);

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
      <Typography variant={variant} gutterBottom>
        {label}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        size: {fontSize} / l-height: {lineHeight} / weight:
        {fontWeight} / letterSpacing: {letterSpacing}
      </Typography>
    </Paper>
  );
}
