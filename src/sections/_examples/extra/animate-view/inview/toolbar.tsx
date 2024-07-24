// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type ToolbarProps = {
  isText: boolean;
  isMulti: boolean;
  onChangeText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeMulti: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: VoidFunction;
};

export default function Toolbar({
  isText,
  isMulti,
  onChangeText,
  onChangeMulti,
  onRefresh,
  ...other
}: ToolbarProps) {
  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      {...other}
    >
      <FormControlLabel
        control={<Switch checked={isText} onChange={onChangeText} />}
        label="Text Object"
      />

      <Box sx={{ flexGrow: 1 }} />

      {!isText && (
        <FormControlLabel
          control={<Switch checked={isMulti} onChange={onChangeMulti} />}
          label="Multi Item"
        />
      )}

      <IconButton onClick={onRefresh}>
        <Iconify icon="eva:refresh-fill" />
      </IconButton>
    </Paper>
  );
}
