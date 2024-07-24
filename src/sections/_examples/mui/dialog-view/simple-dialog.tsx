import { useState, useCallback } from 'react';
// @mui
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// components
import Iconify from 'src/components/iconify';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

const emails = ['username@gmail.com', 'user02@gmail.com'];

export default function SimpleDialog() {
  const dialog = useBoolean();

  const [selectedValue, setSelectedValue] = useState(emails[1]);

  const handleClose = useCallback(
    (value: string) => {
      dialog.onFalse();
      setSelectedValue(value);
    },
    [dialog]
  );

  return (
    <>
      <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
      <br />
      <Button variant="outlined" onClick={dialog.onTrue}>
        Open simple dialog
      </Button>

      <Dialog open={dialog.value} onClose={() => handleClose(selectedValue)}>
        <DialogTitle>Set backup account</DialogTitle>
        <List>
          {emails.map((email) => (
            <ListItemButton onClick={() => handleClose(email)} key={email}>
              <Avatar
                sx={{
                  mr: 2,
                  color: 'info.lighter',
                  bgcolor: 'info.darker',
                }}
              >
                <Iconify icon="solar:user-rounded-bold" />
              </Avatar>
              <ListItemText primary={email} />
            </ListItemButton>
          ))}

          <ListItemButton autoFocus onClick={() => handleClose('addAccount')}>
            <Avatar sx={{ mr: 2 }}>
              <Iconify icon="mingcute:add-line" />
            </Avatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </List>
      </Dialog>
    </>
  );
}
