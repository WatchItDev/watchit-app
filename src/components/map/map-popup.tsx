import { PopupProps } from 'react-map-gl';
// @mui
import { Theme, SxProps } from '@mui/material/styles';
//
import { StyledPopup } from './styles';

// ----------------------------------------------------------------------

interface MapControlPopupProps extends PopupProps {
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export default function MapPopup({ sx, children, ...other }: MapControlPopupProps) {
  return (
    <StyledPopup anchor="bottom" sx={sx} {...other}>
      {children}
    </StyledPopup>
  );
}
