// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const PLACEMENTS = ['top', 'start', 'bottom', 'end'] as const;

// ----------------------------------------------------------------------

export default function SwitchView() {
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
            heading="Switch"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Switch' },
            ]}
            moreLink={['https://mui.com/components/switches']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Basic">
            <Switch defaultChecked />
            <Switch />
            <Switch disabled />
            <Switch disabled checked />
            <Switch defaultChecked color="default" />
          </ComponentBlock>

          <ComponentBlock title="Sizes">
            <FormGroup row>
              <FormControlLabel control={<Switch size="small" />} label="Small" />
              <FormControlLabel control={<Switch />} label="Normal" />
            </FormGroup>
          </ComponentBlock>

          <ComponentBlock title="Placement">
            <FormGroup row>
              {PLACEMENTS.map((placement) => (
                <FormControlLabel
                  key={placement}
                  value={placement}
                  label={placement}
                  labelPlacement={placement}
                  control={<Switch />}
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </FormGroup>
          </ComponentBlock>

          <ComponentBlock title="Colors">
            <FormControl component="fieldset">
              <FormGroup>
                {COLORS.map((color) => (
                  <FormControlLabel
                    key={color}
                    control={<Switch defaultChecked color={color} />}
                    label={color}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}

                <FormControlLabel disabled control={<Switch color="error" />} label="Disabled" />
              </FormGroup>
            </FormControl>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
