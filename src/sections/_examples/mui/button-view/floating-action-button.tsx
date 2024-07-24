import { m } from 'framer-motion';
// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Fab, { fabClasses } from '@mui/material/Fab';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

const COLORS = [
  'default',
  'inherit',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const;

const SIZES = ['small', 'medium', 'large'] as const;

// ----------------------------------------------------------------------

export default function FloatingActionButton() {
  return (
    <Masonry
      columns={2}
      spacing={3}
      sx={{
        [`& .${fabClasses.root}`]: {
          textTransform: 'capitalize',
        },
      }}
    >
      <ComponentBlock title="Default" spacing={2}>
        {COLORS.map((color) => (
          <Fab key={color} color={color}>
            <Iconify icon="ic:round-access-alarm" width={24} />
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {COLORS.map((color) => (
          <Fab key={color} color={color} variant="extended">
            <Iconify icon="ic:round-access-alarm" width={24} />
            {color}
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        <Fab color="info" disabled>
          <Iconify icon="ic:round-access-alarm" width={24} />
        </Fab>

        <Fab color="info" disabled variant="extended">
          <Iconify icon="ic:round-access-alarm" width={24} />
          disabled
        </Fab>
      </ComponentBlock>

      <ComponentBlock title="Outlined" spacing={2}>
        {COLORS.map((color) => (
          <Fab key={color} color={color} variant="outlined">
            <Iconify icon="ic:round-access-alarm" width={24} />
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {COLORS.map((color) => (
          <Fab key={color} color={color} variant="outlinedExtended">
            <Iconify icon="ic:round-access-alarm" width={24} />
            {color}
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        <Fab color="info" disabled variant="outlined">
          <Iconify icon="ic:round-access-alarm" width={24} />
        </Fab>

        <Fab color="info" disabled variant="outlinedExtended">
          <Iconify icon="ic:round-access-alarm" width={24} />
          disabled
        </Fab>
      </ComponentBlock>

      <ComponentBlock title="Soft" spacing={2}>
        {COLORS.map((color) => (
          <Fab key={color} color={color} variant="soft">
            <Iconify icon="ic:round-access-alarm" width={24} />
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {COLORS.map((color) => (
          <Fab key={color} color={color} variant="softExtended">
            <Iconify icon="ic:round-access-alarm" width={24} />
            {color}
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        <Fab color="info" disabled variant="soft">
          <Iconify icon="ic:round-access-alarm" width={24} />
        </Fab>

        <Fab color="info" disabled variant="softExtended">
          <Iconify icon="ic:round-access-alarm" width={24} />
          disabled
        </Fab>
      </ComponentBlock>

      <ComponentBlock title="Sizes" spacing={2}>
        {SIZES.map((size) => (
          <Fab key={size} size={size} color="info">
            <Iconify icon="ic:round-access-alarm" width={24} />
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {SIZES.map((size) => (
          <Fab key={size} size={size} color="info" variant="extended">
            <Iconify icon="ic:round-access-alarm" width={24} />
            {size}
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {SIZES.map((size) => (
          <Fab key={size} size={size} color="info" variant="soft">
            <Iconify icon="ic:round-access-alarm" width={24} />
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {SIZES.map((size) => (
          <Fab key={size} size={size} color="info" variant="softExtended">
            <Iconify icon="ic:round-access-alarm" width={24} />
            {size}
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {SIZES.map((size) => (
          <Fab key={size} size={size} color="info" variant="outlined">
            <Iconify icon="ic:round-access-alarm" width={24} />
          </Fab>
        ))}

        <Box sx={{ display: 'block', width: 1, height: 2 }} />

        {SIZES.map((size) => (
          <Fab key={size} size={size} color="info" variant="outlinedExtended">
            <Iconify icon="ic:round-access-alarm" width={24} />
            {size}
          </Fab>
        ))}
      </ComponentBlock>

      <ComponentBlock title="With Animate" spacing={2}>
        {SIZES.map((size) => (
          <Fab
            key={size}
            component={m.button}
            whileTap="tap"
            whileHover="hover"
            variants={
              (size === 'small' && varHover(1.1, 0.95)) ||
              (size === 'large' && varHover(1.08, 0.99)) ||
              varHover()
            }
            variant="extended"
            size={size}
            color="info"
          >
            <Iconify icon="ic:round-access-alarm" width={24} />
            {size}
          </Fab>
        ))}
      </ComponentBlock>
    </Masonry>
  );
}
