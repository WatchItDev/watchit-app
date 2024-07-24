// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CustomizedStepper from './customized-steppers';
import VerticalLinearStepper from './vertical-linear-stepper';
import HorizontalLinearStepper from './horizontal-linear-stepper';
import LinearAlternativeLabel from './linear-alternative-label-stepper';
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

export default function StepperView() {
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
            heading="Stepper"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Stepper' },
            ]}
            moreLink={['https://mui.com/components/steppers']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock title="Horizontal Linear Stepper">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <HorizontalLinearStepper />
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Linear Alternative Label">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <LinearAlternativeLabel />
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Vertical Linear Stepper">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <VerticalLinearStepper />
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Customized Stepper">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <CustomizedStepper />
            </Paper>
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
