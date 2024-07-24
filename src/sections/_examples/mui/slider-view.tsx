import { useState } from 'react';
// @mui
import Masonry from '@mui/lab/Masonry';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const marks = [
  { value: 0, label: '0°C' },
  { value: 20, label: '20°C' },
  { value: 37, label: '37°C' },
  { value: 100, label: '100°C' },
];

const prices = [
  { value: 0, label: '$0' },
  { value: 25, label: '250' },
  { value: 50, label: '500' },
  { value: 75, label: '750' },
  { value: 100, label: '1000' },
];

// ----------------------------------------------------------------------

function valuePrice(value: number) {
  return value > 0 ? `$${value}0` : `${value}`;
}

function valueLabelFormatPrice(value: number) {
  return value > 0 ? `$${value}` : value;
}

function valuetext(value: number) {
  return `$${value}°C`;
}

function valueLabelFormat(value: number) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

// ----------------------------------------------------------------------

export default function SliderView() {
  const [value, setValue] = useState<number>(30);

  const [price, setPrice] = useState<number[]>([20, 37]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleChangePrice = (event: Event, newValue: number | number[]) => {
    setPrice(newValue as number[]);
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
            heading="Slider"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Slider' },
            ]}
            moreLink={['https://mui.com/components/slider']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 3 }} spacing={3}>
          <ComponentBlock title="Volume">
            <Stack direction="row" alignItems="center" spacing={1} width={1}>
              <Iconify icon="eva:volume-mute-fill" width={24} />
              <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
              <Iconify icon="eva:volume-up-fill" width={24} />
            </Stack>
          </ComponentBlock>

          <ComponentBlock title="Disabled">
            <Slider disabled defaultValue={30} />
          </ComponentBlock>

          <ComponentBlock title="Temperature">
            <Slider
              defaultValue={30}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={110}
            />
          </ComponentBlock>

          <ComponentBlock title="Sizes">
            <Slider
              size="medium"
              marks
              min={10}
              step={10}
              max={110}
              defaultValue={30}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
            />

            <Slider
              marks
              min={10}
              step={10}
              max={110}
              defaultValue={30}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
            />
          </ComponentBlock>

          <ComponentBlock title="Small steps">
            <Slider
              defaultValue={0.00000005}
              getAriaValueText={valuetext}
              step={0.00000001}
              marks
              min={-0.00000005}
              max={0.0000001}
              valueLabelDisplay="auto"
            />
          </ComponentBlock>

          <ComponentBlock title="Custom marks">
            <Slider
              defaultValue={20}
              getAriaValueText={valuetext}
              step={10}
              valueLabelDisplay="auto"
              marks={marks}
            />
          </ComponentBlock>

          <ComponentBlock title="Restricted values">
            <Slider
              defaultValue={20}
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={valuetext}
              step={null}
              valueLabelDisplay="auto"
              marks={marks}
            />
          </ComponentBlock>

          <ComponentBlock title="Range">
            <Box sx={{ width: '100%' }}>
              <Slider
                scale={(x) => x * 10}
                step={10}
                marks={prices}
                value={price}
                onChange={handleChangePrice}
                valueLabelDisplay="on"
                getAriaValueText={valuePrice}
                valueLabelFormat={valueLabelFormatPrice}
              />
            </Box>
            <Box
              sx={{
                p: 2,
                width: '100%',
                borderRadius: 1,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Min: {valuePrice(price[0])}
              </Typography>
              <Typography variant="subtitle2">Max: {valuePrice(price[1])}</Typography>
            </Box>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
