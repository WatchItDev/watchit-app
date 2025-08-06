import { FC, useEffect, useMemo, useState } from 'react';
import { Typography, Box, TextField, Stack, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@redux/auth';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useTransfer } from '@src/hooks/protocol/use-transfer.ts';
import { Post } from '@src/graphql/generated/graphql.ts';
import { notifyError, notifySuccess } from '@src/libs/notifications/internal-notifications.ts';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import { SUCCESS } from '@src/libs/notifications/success.ts';
import { GetTipsByBakerForPostDocument, useCreateTipMutation } from '@src/graphql/generated/hooks.tsx';

const tipOptions = [
  { value: '10', title: '10', subtitle: 'A token of appreciation' },
  { value: '50', title: '50', subtitle: 'Show more support' },
  { value: '100', title: '100', subtitle: 'Go the extra mile' },
];

export const LeaveTipCard: FC<{ post: Post }> = ({ post }) => {
  const dispatch = useDispatch();
  const { session } = useAuth();
  const { transfer, loading: transferLoading, error } = useTransfer();
  const [createTip] = useCreateTipMutation();

  const [selectedTip, setSelectedTip] = useState('10');
  const [customTip, setCustomTip] = useState('');

  useEffect(() => {
    if (error) {
      notifyError(error as ERRORS);
    }
  }, [error]);

  const amount = useMemo(() => {
    // Si hay custom, usa custom. Sino, usa el seleccionado.
    const raw = selectedTip ? selectedTip : customTip;
    const parsed = Number(raw);
    // Evita NaN o negativos
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [selectedTip, customTip]);

  const recipient = post?.author?.address ?? '';

  const handleTipChange = (value: string) => {
    setSelectedTip(value);
    setCustomTip('');
  };

  const handleCustomTipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTip('');
    setCustomTip(event.target.value);
  };

  const handleSendTip = async () => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }

    if (!recipient || amount <= 0) {return;}

    try {
      await transfer({ amount, recipient });

      await createTip({
        variables: {
          input: {
            postId:  post.id,
            creator: recipient,
            amount,
            txHash: null,
            message: 'tip',
          },
        },
        refetchQueries: [
          { query: GetTipsByBakerForPostDocument, variables: { postId: post.id } },
        ],
        awaitRefetchQueries: true,
      });

      notifySuccess(SUCCESS.TIP_CREATED_SUCCESSFULLY);
    } catch (e) {
      console.error('Transfer error:', e);
    }
  };

  const isDisabled = transferLoading || amount <= 0 || !recipient;

  return (
    <Card sx={{ width: '100%', maxWidth: { lg: 400 }, margin: 'auto', backgroundColor: '#2B2D31' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Support to {post.author.displayName}
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
                  border:
                    selectedTip === option.value
                      ? '2px solid rgba(255,255,255,0.3)'
                      : '2px solid transparent',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Typography variant="body1" fontWeight="bold" align="center">
                  {option.title}
                </Typography>
                <Typography variant="subtitle2" align="center" sx={{ fontSize: '0.7rem' }}>
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
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <LoadingButton
            variant="contained"
            sx={{ width: '100%', py: 1.5 }}
            loading={transferLoading}
            disabled={isDisabled}
            onClick={handleSendTip}
          >
            Leave a Tip
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
};
