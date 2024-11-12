import { useState } from 'react';
import { Typography, Box, TextField, Stack, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useOpenAction, OpenActionKind } from '@lens-protocol/react-web';
import { ethers } from 'ethers';
import { encodeData } from '@lens-protocol/client';
import { useAuth } from '@src/hooks/use-auth.ts';
import LoadingButton from '@mui/lab/LoadingButton';

const TIP_ACTION_MODULE_ADDRESS = '0x22cb67432C101a9b6fE0F9ab542c8ADD5DD48153';
const MMC_ADDRESS = '0x30f106094dB26F4e17439DfCD19A315573bCad0c';

const tipOptions = [
  { value: '10', title: '10 MMC', subtitle: 'A token of appreciation' },
  { value: '50', title: '50 MMC', subtitle: 'Show more support' },
  { value: '100', title: '100 MMC', subtitle: 'Go the extra mile' },
];

export const LeaveTipCard = ({ post, tipReceiver }) => {
  const [selectedTip, setSelectedTip] = useState('10');
  const [customTip, setCustomTip] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const { selectedProfile } = useAuth();
  const amountInWei = ethers.parseUnits(
    customTip || selectedTip,
    18
  );
  const callData = encodeData(
    [
      { type: 'address', name: 'currency' },
      { type: 'uint256', name: 'tipAmount' },
    ],
    [MMC_ADDRESS, amountInWei.toString()]
  );
  const { execute: tipAction, loading, data } = useOpenAction({
    action: {
      kind: OpenActionKind.UNKNOWN,
      address: TIP_ACTION_MODULE_ADDRESS,
      data: callData,
    },
  });

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

  const handleSendTip = async () => {
    if (!selectedProfile) {
      alert('Please log in to leave a tip');
      return;
    }

    setSuccessMessage(false);

    try {
      const result = await tipAction({ publication: post });

      if (result.isFailure()) {
        console.error('Error sending tip:', result.error);
        alert('Failed to send tip');
      } else {
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 2000);
      }
    } catch (error) {
      console.error('Error during tip action:', error);
      alert('An error occurred while sending the tip');
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', backgroundColor: '#2B2D31' }}>
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
                <Typography variant="body1" fontWeight="bold">{option.title}</Typography>
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
            onClick={handleSendTip}
            disabled={loading || (!selectedTip && !customTip)}
            sx={{ width: '100%', py: 1.5 }}
            loading={loading}
          >
            Leave a Tip
          </LoadingButton>
        </Stack>

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
