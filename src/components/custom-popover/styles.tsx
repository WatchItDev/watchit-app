// @mui
import { styled, alpha } from '@mui/material/styles';
// theme
import { bgBlur } from 'src/theme/css';
//
import { MenuPopoverArrowValue } from './types';

// ----------------------------------------------------------------------

export const StyledArrow = styled('span')<{ arrow: MenuPopoverArrowValue }>(({ arrow, theme }) => {
  const SIZE = 14;

  const POSITION = -(SIZE / 2) + 0.5;

  const topStyle = {
    top: POSITION,
    transform: 'rotate(135deg)',
  };

  const bottomStyle = {
    bottom: POSITION,
    transform: 'rotate(-45deg)',
  };

  const leftStyle = {
    left: POSITION,
    transform: 'rotate(45deg)',
  };

  const rightStyle = {
    right: POSITION,
    transform: 'rotate(-135deg)',
  };

  return {
    width: SIZE,
    height: SIZE,
    position: 'absolute',
    borderBottomLeftRadius: SIZE / 4,
    clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
    border: `solid 1px ${alpha(
      theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
      0.12
    )}`,
    ...bgBlur({
      color: theme.palette.background.paper,
    }),
    // Top
    ...(arrow === 'top-left' && { ...topStyle, left: 20 }),
    ...(arrow === 'top-center' && {
      ...topStyle,
      left: 0,
      right: 0,
      margin: 'auto',
    }),
    ...(arrow === 'top-right' && { ...topStyle, right: 20 }),
    // Bottom
    ...(arrow === 'bottom-left' && { ...bottomStyle, left: 20 }),
    ...(arrow === 'bottom-center' && {
      ...bottomStyle,
      left: 0,
      right: 0,
      margin: 'auto',
    }),
    ...(arrow === 'bottom-right' && { ...bottomStyle, right: 20 }),
    // Left
    ...(arrow === 'left-top' && { ...leftStyle, top: 20 }),
    ...(arrow === 'left-center' && {
      ...leftStyle,
      top: 0,
      bottom: 0,
      margin: 'auto',
    }),
    ...(arrow === 'left-bottom' && { ...leftStyle, bottom: 20 }),
    // Right
    ...(arrow === 'right-top' && { ...rightStyle, top: 20 }),
    ...(arrow === 'right-center' && {
      ...rightStyle,
      top: 0,
      bottom: 0,
      margin: 'auto',
    }),
    ...(arrow === 'right-bottom' && { ...rightStyle, bottom: 20 }),
  };
});
