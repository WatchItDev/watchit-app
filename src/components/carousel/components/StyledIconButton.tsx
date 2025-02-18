import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

interface StyledIconButtonProps {
  filled?: boolean;
  shape?: 'circular' | 'rounded';
}

export const StyledIconButton = styled(IconButton)<StyledIconButtonProps>(
  ({ filled, shape, theme }) => ({
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(shape === 'rounded' && {
      borderRadius: theme.shape.borderRadius * 1.5,
    }),
    ...(!filled && {
      opacity: 0.48,
      '&:hover': {
        opacity: 1,
      },
    }),
    ...(filled && {
      color: alpha(theme.palette.common.white, 0.8),
      backgroundColor: alpha(theme.palette.grey[900], 0.48),
      '&:hover': {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.grey[900],
      },
    }),
  })
);
