// @mui
import { useTheme } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
// hooks
import { useResponsive } from '@src/hooks/use-responsive';
// theme
import { bgBlur } from '@src/theme/css';
// components
import Iconify from '@src/components/iconify';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setCollapsed, toggleMinibar } from '@redux/minibar';
import { NAV } from '../config-layout';

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }: IconButtonProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const lgUp = useResponsive('up', 'lg');
  // @ts-expect-error No error in this context
  const minibarState = useSelector((state) => state.minibar.state);

  if (!lgUp) {
    return null;
  }

  const handleToggleMinibar = () => {
    dispatch(setCollapsed(true));
    dispatch(toggleMinibar());
  };

  return (
    <IconButton
      size="small"
      onClick={handleToggleMinibar}
      sx={{
        p: 0.5,
        top: NAV.TOGGLE_TOP,
        position: 'fixed',
        left: NAV.W_VERTICAL + NAV.W_MINI - 12,
        zIndex: theme.zIndex.appBar + 2,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        icon={
          minibarState === 'vertical' ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'
        }
      />
    </IconButton>
  );
}
