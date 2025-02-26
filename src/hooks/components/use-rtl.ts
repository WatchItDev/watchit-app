import { useTheme } from '@mui/material/styles';

export const useIsRTL = (): boolean => {
  const theme = useTheme();
  return theme.direction === 'rtl';
};
