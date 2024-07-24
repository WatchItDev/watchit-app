import { useState } from 'react';
// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const PLACEMENTS = ['top', 'start', 'bottom', 'end'] as const;

// ----------------------------------------------------------------------

export default function CheckboxView() {
  const [checked, setChecked] = useState([true, false]);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

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
            heading="Checkboxes"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Checkboxes' },
            ]}
            moreLink={['https://mui.com/components/checkboxes']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Basic">
            <Checkbox size="medium" />
            <Checkbox size="medium" defaultChecked />
            <Checkbox size="medium" defaultChecked indeterminate />
            <Checkbox size="medium" disabled />
            <Checkbox size="medium" disabled defaultChecked />
            <Checkbox size="medium" disabled indeterminate />
          </ComponentBlock>

          <ComponentBlock title="Size & Custom Icon">
            <FormControlLabel label="Normal" control={<Checkbox size="medium" defaultChecked />} />
            <FormControlLabel label="Small" control={<Checkbox size="small" defaultChecked />} />
            <FormControlLabel
              control={
                <Checkbox
                  color="info"
                  size="small"
                  icon={<Iconify icon="solar:heart-bold" />}
                  checkedIcon={<Iconify icon="solar:heart-bold" />}
                />
              }
              label="Custom icon"
            />

            <FormControlLabel
              control={
                <Checkbox
                  color="error"
                  size="small"
                  icon={<Iconify icon="eva:award-fill" />}
                  checkedIcon={<Iconify icon="eva:award-fill" />}
                />
              }
              label="Custom icon"
            />
          </ComponentBlock>

          <ComponentBlock title="Placement">
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                {PLACEMENTS.map((placement) => (
                  <FormControlLabel
                    key={placement}
                    value={placement}
                    label={placement}
                    labelPlacement={placement}
                    control={<Checkbox size="medium" />}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </ComponentBlock>

          <ComponentBlock title="Colors">
            <FormGroup>
              {COLORS.map((color) => (
                <FormControlLabel
                  key={color}
                  control={<Checkbox size="medium" defaultChecked color={color} />}
                  label={color}
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}

              <FormControlLabel
                disabled
                control={<Checkbox size="medium" defaultChecked color="error" />}
                label="Disabled"
              />
            </FormGroup>

            <FormControl component="fieldset">
              <FormGroup>
                {COLORS.map((color) => (
                  <FormControlLabel
                    key={color}
                    control={<Checkbox size="medium" defaultChecked indeterminate color={color} />}
                    label={color}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}

                <FormControlLabel
                  disabled
                  control={<Checkbox size="medium" defaultChecked indeterminate color="error" />}
                  label="Disabled"
                />
              </FormGroup>
            </FormControl>
          </ComponentBlock>

          <ComponentBlock title="Indeterminate">
            <div>
              <FormControlLabel
                label="Parent"
                control={
                  <Checkbox
                    size="medium"
                    checked={checked[0] && checked[1]}
                    indeterminate={checked[0] !== checked[1]}
                    onChange={handleChange1}
                  />
                }
              />
              <div>
                <FormControlLabel
                  label="Child 1"
                  control={<Checkbox size="medium" checked={checked[0]} onChange={handleChange2} />}
                />
                <FormControlLabel
                  label="Child 2"
                  control={<Checkbox size="medium" checked={checked[1]} onChange={handleChange3} />}
                />
              </div>
            </div>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
