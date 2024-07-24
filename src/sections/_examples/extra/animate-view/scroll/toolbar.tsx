// @mui
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type ToolbarProps = {
  onRefresh: VoidFunction;
};

export default function Toolbar({ onRefresh, ...other }: ToolbarProps) {
  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
      {...other}
    >
      <IconButton onClick={onRefresh}>
        <Iconify icon="eva:refresh-fill" />
      </IconButton>
    </Paper>
  );
}
