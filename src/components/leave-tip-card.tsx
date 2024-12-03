import { FC, useCallback, useEffect, useState } from 'react';
import { Typography, Box, TextField, Stack, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  useOpenAction,
  OpenActionKind,
  useLazyModuleMetadata,
  development, ProfileSession, useSession,
} from '@lens-protocol/react-web';
import { ethers } from 'ethers';
import { encodeData, LensClient, LensClientConfig } from '@lens-protocol/client';
import LoadingButton from '@mui/lab/LoadingButton';
import { ModuleParam } from '@lens-protocol/react';
import TipActionModuleAbi from '@src/config/abi/TipActionModule.json';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

const TIP_ACTION_MODULE_ADDRESS = '0xe95A8326EBd29B6574875806474d6f9734De80A5';
const MMC_ADDRESS = '0xdC2E7C4444730980CEB8982CfC8A1c4902fa36bE';
const abi = TipActionModuleAbi;
const client = new LensClient({
  environment: development
} as LensClientConfig);

const tipOptions = [
  { value: '10', title: '10', subtitle: 'A token of appreciation' },
  { value: '50', title: '50', subtitle: 'Show more support' },
  { value: '100', title: '100', subtitle: 'Go the extra mile' },
];

interface LeaveTipCardProps {
  post: any
}

export const LeaveTipCard: FC<LeaveTipCardProps> = ({ post }) => {
  const [selectedTip, setSelectedTip] = useState('10');
  const [customTip, setCustomTip] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const { data: metadata, error, loading: loadingMetadata, execute } = useLazyModuleMetadata();
  // const amountInWei = ethers.parseUnits(
  //   customTip || selectedTip,
  //   18
  // );
  const amountInWei = ethers.parseUnits(
    '10',
    18
  );

  console.log('abi')
  console.log(abi)
  console.log('----')
  console.log('metadata')
  console.log(metadata)
  console.log(error)
  console.log(loadingMetadata)
  console.log('----')

  const processCallData: ModuleParam[] = [
    { type: 'address', name: 'currency' },
    { type: 'uint256', name: 'tipAmount' },
  ]

  const callData = encodeData(
    processCallData,
    [MMC_ADDRESS, amountInWei.toString()]
  );


  console.log('call data')
  console.log(callData)
  console.log(processCallData)
  console.log(MMC_ADDRESS)
  console.log(amountInWei.toString())

  const { execute: tipAction, loading, data } = useOpenAction({
    action: {
      kind: OpenActionKind.UNKNOWN,
      address: TIP_ACTION_MODULE_ADDRESS,
      data: callData,
    },
  });

  const getModules = async () => {
    console.log('hello client')
    console.log(client)
    console.log(client.modules)

    const page = await client.modules.supportedOpenActionModules({
      includeUnknown: true,
      onlyVerified: true
    });

    console.log('hello modules')
    console.log(page)
  }

  useEffect(() => {
    execute({ implementation: '0xe95A8326EBd29B6574875806474d6f9734De80A5' }).then((d) => {
      console.log('hello executed')
      console.log(d)
    })

    getModules()
  }, []);

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

  const handleSendTip = useCallback(async () => {

    console.log('call data')
    console.log(callData)

    if (!sessionData?.profile) {
      alert('Please log in to leave a tip');
      return;
    }

    setSuccessMessage(false);

    try {
      const result = await tipAction({ publication: post });

      console.log('result')
      console.log(result)

      if (result.isFailure()) {
        console.log(result.error);
        console.error('Error sending tip:', result.error);
        alert('Failed to send tip');
      } else {
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 2000);
      }
    } catch (error) {
      console.log(error);
      console.log(JSON.stringify(error));
      console.error('Error during tip action:', error);
      alert('An error occurred while sending the tip');
    }
  }, []);

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
            // onClick={handleSendTip}
            // disabled={loading || (!selectedTip && !customTip)}
            onClick={() => {}}
            disabled={true}
            sx={{ width: '100%', py: 1.5 }}
            loading={loading}
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
