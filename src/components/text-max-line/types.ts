import { LinkProps } from '@mui/material/Link'
import { Variant } from '@mui/material/styles/createTypography'
import { TypographyProps } from '@mui/material/Typography'

type IProps = TypographyProps & LinkProps;

export interface TextMaxLineProps extends IProps {
  line?: number;
  asLink?: boolean;
  persistent?: boolean;
  children: React.ReactNode;
  variant?: Variant;
}
