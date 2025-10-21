import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { GRID_CONFIG } from '../../CONSTANTS';

/** Shared styled primitives for the expander wrapper. */

export const AnimatedContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
}));

export const SectionContainer = styled(Paper)(() => ({
  position: 'relative',
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  margin: 0,
  backgroundColor: 'transparent',
  boxShadow: 'none',
}));

export const SectionContent = styled(Box)(() => ({
  position: 'relative',
  padding: `0 ${GRID_CONFIG.gap}px`,
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
}));

export const OpacityLayer = styled(Box)(() => ({
  width: '100%',
  height: '100%',
}));
