import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface StyledGridItemProps {
  isExpanded: boolean;
  isDimmed: boolean;
  animationDuration: number;
  transitionsEnabled?: boolean;
}

export const StyledGridItem = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isExpanded' && prop !== 'isDimmed' && prop !== 'animationDuration' && prop !== 'transitionsEnabled',
})<StyledGridItemProps>(({ isExpanded, animationDuration, transitionsEnabled }) => ({
  position: 'absolute',
  borderRadius: 12,
  cursor: 'pointer',
  transition: transitionsEnabled
    ? `top ${animationDuration}ms cubic-bezier(0.4,0,0.2,1),
       left ${animationDuration}ms cubic-bezier(0.4,0,0.2,1),
       transform ${animationDuration}ms cubic-bezier(0.4,0,0.2,1),
       box-shadow ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)`
    : 'none',
  transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
  boxShadow: isExpanded ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
  zIndex: isExpanded ? 1000 : 1,
  '&:hover': {
    transform: isExpanded ? 'scale(1.02)' : 'scale(1.05)',
    boxShadow: isExpanded ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 6px 24px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
  },
  '&:active': { transform: isExpanded ? 'scale(1.02)' : 'scale(0.98)' },
  willChange: 'top, left, transform',
  contain: 'layout paint style',
}));

export const ItemContent = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    borderRadius: 'inherit',
  },
}));
