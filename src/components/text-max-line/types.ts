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

export interface FontProperties {
  fontSize: string;
  lineHeight: string | number;
  fontWeight: number | string;
  letterSpacing: string;
}
