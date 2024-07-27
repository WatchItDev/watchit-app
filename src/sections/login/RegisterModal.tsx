import { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';

export function  RegisterModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (username: string) => void }) {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    onSubmit(username);
    setUsername('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          m: 'auto',
          mt: '10%',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create a New Account
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Register
        </Button>
      </Box>
    </Modal>
  );
}
