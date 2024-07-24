// @mui
import { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

export interface ColorPreviewProps extends StackProps {
  colors: string[];
  limit?: number;
}

export interface ColorPickerProps extends StackProps {
  multi?: boolean;
  colors: string[];
  selected: string | string[];
  limit?: 'auto' | number;
  onSelectColor: (color: string | string[]) => void;
}
