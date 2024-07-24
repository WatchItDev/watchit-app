import { m } from 'framer-motion';
// @mui
import Masonry from '@mui/lab/Masonry';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

const COLORS = [
  'inherit',
  'default',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const;

const SIZES = ['small', 'medium', 'large'] as const;

// ----------------------------------------------------------------------

export default function IconButtons() {
  return (
    <Masonry columns={2} spacing={3}>
      <ComponentBlock title="Base">
        <IconButton color="inherit">
          <Iconify icon="ic:round-access-alarm" />
        </IconButton>

        <IconButton>
          <Iconify icon="ic:round-access-alarm" />
        </IconButton>

        <IconButton color="primary">
          <Iconify icon="ic:round-access-alarm" />
        </IconButton>

        <IconButton color="secondary">
          <Iconify icon="ic:round-access-alarm" />
        </IconButton>

        <IconButton disabled>
          <Iconify icon="ic:round-access-alarm" />
        </IconButton>
      </ComponentBlock>

      <ComponentBlock title="Colors">
        {COLORS.map((color) => (
          <IconButton key={color} color={color}>
            <Iconify icon="ic:round-access-alarm" />
          </IconButton>
        ))}
      </ComponentBlock>

      <ComponentBlock title="Sizes">
        {SIZES.map((size) => (
          <IconButton key={size} size={size} color="info">
            <Iconify icon="ic:round-access-alarm" />
          </IconButton>
        ))}
      </ComponentBlock>

      <ComponentBlock title="With Animate">
        {SIZES.map((size) => (
          <IconButton
            key={size}
            component={m.button}
            whileTap="tap"
            whileHover="hover"
            variants={
              (size === 'small' && varHover(1.1, 0.95)) ||
              (size === 'large' && varHover(1.08, 0.99)) ||
              varHover()
            }
            size={size}
            color="error"
          >
            <Iconify fontSize="inherit" icon="ic:round-access-alarm" />
          </IconButton>
        ))}
      </ComponentBlock>
    </Masonry>
  );
}
