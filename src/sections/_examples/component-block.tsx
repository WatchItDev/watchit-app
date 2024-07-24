// @mui
import { Theme, alpha, SxProps } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import Stack, { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  title?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function ComponentBlock({ title, sx, children, ...other }: BlockProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        borderStyle: 'dashed',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      {title && <CardHeader title={title} />}

      <Stack
        spacing={3}
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        sx={{
          p: 5,
          minHeight: 180,
          ...sx,
        }}
        {...other}
      >
        {children}
      </Stack>
    </Paper>
  );
}
