import { useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
//
import Toolbar from './toolbar';
import ContainerView from './container';
import ControlPanel from '../control-panel';

// ----------------------------------------------------------------------

export default function BackgroundView() {
  const [count, setCount] = useState(0);
  const [selectVariant, setSelectVariant] = useState('kenburnsTop');

  const handleChangeVariant = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(count + 1);
    setSelectVariant(event.target.value);
  };

  return (
    <Card sx={{ p: 3 }}>
      <Grid container sx={{ mb: 3 }}>
        <Grid xs={12} md={9}>
          <Toolbar onRefresh={() => setCount(count + 1)} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={9}>
          <ContainerView key={count} selectVariant={selectVariant} />
        </Grid>

        <Grid xs={12} md={3}>
          <ControlPanel
            variantKey={variantKey}
            selectVariant={selectVariant}
            onChangeVariant={handleChangeVariant}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

// ----------------------------------------------------------------------

const variantKey = [
  {
    type: 'kenburns',
    values: ['kenburnsTop', 'kenburnsBottom', 'kenburnsLeft', 'kenburnsRight'],
  },
  {
    type: 'pan',
    values: ['panTop', 'panBottom', 'panLeft', 'panRight'],
  },
  {
    type: 'color change',
    values: ['color2x', 'color3x', 'color4x', 'color5x'],
  },
];
