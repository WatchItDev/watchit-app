// @mui
import { alpha, Theme, SxProps } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
//
import { ItemProps } from '../types';

// ----------------------------------------------------------------------

type Props = {
  node: ItemProps;
  sx?: SxProps<Theme>;
};

export default function SimpleNode({ node, sx }: Props) {
  return (
    <Card
      sx={{
        p: 2,
        boxShadow: 'none',
        borderRadius: 1.5,
        display: 'inline-flex',
        textTransform: 'capitalize',
        color: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : 'primary.lighter'),
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        ...sx,
      }}
    >
      <Typography variant="subtitle2">{node.name}</Typography>
    </Card>
  );
}
