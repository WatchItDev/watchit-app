import { useState } from 'react';
// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Container from '@mui/material/Container';
import RadioGroup from '@mui/material/RadioGroup';
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

export default function RadioButtonView() {
  const [value, setValue] = useState('a1');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
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
            heading="Radio Buttons"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Radio Buttons' },
            ]}
            moreLink={['https://mui.com/components/radio-buttons']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Basic">
            <FormControl component="fieldset">
              <RadioGroup row defaultValue="nn">
                <Radio size="medium" value="nn" />
                <Radio size="medium" value="gg" />
                <Radio size="medium" disabled value="hh" />
              </RadioGroup>
            </FormControl>
          </ComponentBlock>

          <ComponentBlock title="Sizes">
            <RadioGroup row defaultValue="g">
              <FormControlLabel value="g" control={<Radio size="medium" />} label="Normal" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="Small" />
            </RadioGroup>
          </ComponentBlock>

          <ComponentBlock title="Placement">
            <FormControl component="fieldset">
              <RadioGroup row defaultValue="top">
                {PLACEMENTS.map((placement) => (
                  <FormControlLabel
                    key={placement}
                    value={placement}
                    label={placement}
                    labelPlacement={placement}
                    control={<Radio size="medium" />}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </ComponentBlock>

          <ComponentBlock title="Colors">
            <FormControl component="fieldset">
              <RadioGroup value={value} onChange={handleChange}>
                {COLORS.map((color) => (
                  <FormControlLabel
                    key={color}
                    value={color}
                    control={<Radio size="medium" color={color} />}
                    label={color}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}

                <FormControlLabel
                  disabled
                  value="a8"
                  control={<Radio size="medium" color="error" />}
                  label="Disabled"
                />
              </RadioGroup>
            </FormControl>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
