// @mui
import { LinkProps } from '@mui/material/Link';
import { TypographyProps } from '@mui/material/Typography';
import { Variant } from '@mui/material/styles/createTypography';

// ----------------------------------------------------------------------

type IProps = TypographyProps & LinkProps;

export interface TextMaxLineProps extends IProps {
  line?: number;
  asLink?: boolean;
  persistent?: boolean;
  children: React.ReactNode;
  variant?: Variant;
}
