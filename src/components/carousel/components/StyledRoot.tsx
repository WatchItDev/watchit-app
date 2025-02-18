import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { bgBlur } from '@src/theme/css';

interface StyledRootProps {
  blur?: boolean;
}

export const StyledRoot = styled(Box)<StyledRootProps>(({ blur, theme }) => ({
  ...(blur &&
    bgBlur({
      opacity: 0.48,
      color: theme.palette.grey[900],
    })),
  zIndex: 9,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
}));
