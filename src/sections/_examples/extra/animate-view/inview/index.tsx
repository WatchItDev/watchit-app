import { useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import Toolbar from './toolbar';
import ControlPanel from '../control-panel';
import ContainerView from './container';

// ----------------------------------------------------------------------

export default function Inview() {
  const [count, setCount] = useState(0);

  const multi = useBoolean();

  const text = useBoolean();

  const [selectVariant, setSelectVariant] = useState('slideInUp');

  const handleRefresh = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  const handleChangeVariant = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCount(count + 1);
      setSelectVariant((event.target as HTMLInputElement).value);
    },
    [count]
  );

  return (
    <Card sx={{ p: 3 }}>
      <Grid container sx={{ mb: 3 }}>
        <Grid xs={12} md={9}>
          <Toolbar
            isText={text.value}
            isMulti={multi.value}
            onChangeText={text.onToggle}
            onChangeMulti={multi.onToggle}
            onRefresh={handleRefresh}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={9}>
          <ContainerView
            key={count}
            isText={text.value}
            isMulti={multi.value}
            selectVariant={selectVariant}
          />
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
    type: 'slide in',
    values: ['slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight'],
  },
  {
    type: 'slide out',
    values: ['slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight'],
  },
  {
    type: 'fade in',
    values: ['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight'],
  },
  {
    type: 'fade out',
    values: ['fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight'],
  },
  {
    type: 'zoom in',
    values: ['zoomIn', 'zoomInUp', 'zoomInDown', 'zoomInLeft', 'zoomInRight'],
  },
  {
    type: 'zoom out',
    values: ['zoomOut', 'zoomOutUp', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight'],
  },
  {
    type: 'bounce in',
    values: ['bounceIn', 'bounceInUp', 'bounceInDown', 'bounceInLeft', 'bounceInRight'],
  },
  {
    type: 'bounce out',
    values: ['bounceOut', 'bounceOutUp', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight'],
  },
  {
    type: 'flip in',
    values: ['flipInX', 'flipInY'],
  },
  {
    type: 'flip out',
    values: ['flipOutX', 'flipOutY'],
  },
  {
    type: 'scale in',
    values: ['scaleInX', 'scaleInY'],
  },
  {
    type: 'scale out',
    values: ['scaleOutX', 'scaleOutY'],
  },
  {
    type: 'rotate in',
    values: ['rotateIn'],
  },
  {
    type: 'rotate out',
    values: ['rotateOut'],
  },
];
