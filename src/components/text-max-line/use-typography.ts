import { useTheme } from '@mui/material/styles';
import { Variant } from '@mui/material/styles/createTypography';
import { useWidth } from '@src/hooks/use-responsive';
import { FontProperties } from '@src/components/text-max-line/types.ts';

function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export default function useTypography(variant: Variant) {
  const theme = useTheme();

  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === 'xl' ? 'lg' : breakpoints);

  const hasResponsive =
    variant === 'h1' ||
    variant === 'h2' ||
    variant === 'h3' ||
    variant === 'h4' ||
    variant === 'h5' ||
    variant === 'h6';

  const getFont: FontProperties =
    hasResponsive && theme.typography[variant][key]
      ? {
          fontSize: theme.typography[variant][key].fontSize,
          lineHeight: theme.typography[variant][key].lineHeight,
          fontWeight: theme.typography[variant][key].fontWeight,
          letterSpacing: theme.typography[variant][key].letterSpacing,
        }
      : {
          fontSize: theme.typography[variant].fontSize,
          lineHeight: theme.typography[variant].lineHeight,
          fontWeight: theme.typography[variant].fontWeight,
          letterSpacing: theme.typography[variant].letterSpacing,
        };

  const fontSize = remToPx(getFont.fontSize);
  const lineHeight = Number(getFont.lineHeight) * fontSize;
  const { fontWeight, letterSpacing } = getFont;

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}
