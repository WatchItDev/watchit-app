import { FC, useState } from 'react';
import { Typography, Box, TextField, Stack, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';

const tipOptions = [
  { value: '10', title: '10', subtitle: 'A token of appreciation' },
  { value: '50', title: '50', subtitle: 'Show more support' },
  { value: '100', title: '100', subtitle: 'Go the extra mile' },
];

export const LeaveTipCard: FC = () => {
  const [selectedTip, setSelectedTip] = useState('10');
  const [customTip, setCustomTip] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleTipChange = (value: string) => {
    setSelectedTip(value);
    setCustomTip('');
    setSuccessMessage(false);
  };

  const handleCustomTipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTip('');
    setCustomTip(event.target.value);
    setSuccessMessage(false);
  };

  return (

    <Card sx={{width: '100%', maxWidth: {lg: 400}, margin: 'auto', backgroundColor: '#2B2D31' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Support the Creator
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Choose an amount to leave a tip and support the content you love.
        </Typography>
        <Stack spacing={2}>
          <Stack spacing={2} direction="row">
            {tipOptions.map((option) => (
              <Paper
                key={option.value}
                onClick={() => handleTipChange(option.value)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  width: '33%',
                  backgroundColor: '#1e1f22',
                  opacity: selectedTip === option.value ? 1 : 0.4,
                  border: selectedTip === option.value ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Typography variant="body1" fontWeight="bold" align={'center'}>
                  {option.title}
                </Typography>
                <Typography variant="subtitle2" align={'center'} style={{
                  color: 'text.secondary',
                  fontSize: '0.7rem'
                }}>
                  MMC
                </Typography>
              </Paper>
            ))}
          </Stack>
          <Box>
            <TextField
              type="number"
              placeholder="Enter custom tip in MMC"
              fullWidth
              value={customTip}
              onChange={handleCustomTipChange}
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <LoadingButton
            variant="contained"
            onClick={() => {}}
            disabled={true}
            sx={{ width: '100%', py: 1.5 }}
            loading={false}
          >
            Leave a Tip
          </LoadingButton>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          This feature is coming in the next release!
        </Typography>

        {successMessage && (
          <Typography
            variant="body2"
            color="success.main"
            align="center"
            sx={{ mt: 2 }}
          >
            Tip sent successfully! Thank you for your support.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
