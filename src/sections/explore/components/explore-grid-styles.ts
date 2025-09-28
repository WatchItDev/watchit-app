import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/** Wrapper for the overall explore grid canvas. */
export const GridContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  overflow: 'hidden',
}));

/** Inner container that hosts positioned items and skeleton placeholders. */
export const GridWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  padding: theme.spacing(2),
}));

/** Loading feedback displayed below the grid when fetching more content. */
export const LoadingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));
