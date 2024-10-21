// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// hooks
import { useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useState, useEffect } from 'react';
// theme
import { bgGradient } from 'src/theme/css';
import LoadingButton from '@mui/lab/LoadingButton';
import { Profile } from '@lens-protocol/api-bindings';
import { _userAbout } from '../../_mock';
import { useAuth } from '../../hooks/use-auth';

// ----------------------------------------------------------------------

interface ProfileCoverProps {
  profile?: Profile;
}

export default function ProfileCover({ profile }: ProfileCoverProps) {
  const theme = useTheme();
  const { selectedProfile } = useAuth();
  const [isFollowed, setIsFollowed] = useState(false);

  // State to handle error and success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hooks for follow and unfollow actions
  const { execute: follow, error: followError, loading: followLoading } = useFollow();
  const { execute: unfollow, error: unfollowError, loading: unfollowLoading } = useUnfollow();

  // Handle errors from follow and unfollow actions
  useEffect(() => {
    if (followError) {
      setErrorMessage(followError.message);
    }
    if (unfollowError) {
      setErrorMessage(unfollowError.message);
    }
  }, [followError, unfollowError]);

  useEffect(() => {
    setIsFollowed(!!profile?.operations?.isFollowedByMe?.value)
  }, [selectedProfile, profile]);

  // Function to handle following a profile
  const handleFollow = async () => {
    if (!profile) return

    try {
      const result = await follow({ profile });
      if (result.isSuccess()) {
        setSuccessMessage('Successfully followed the profile.');
        // Wait for transaction confirmation
        await result.value.waitForCompletion();
      } else {
        // Handle specific follow errors
        handleFollowError(result.error);
      }
    } catch (error) {
      setErrorMessage('An error occurred while trying to follow the profile.');
    }
  };

  // Function to handle unfollowing a profile
  const handleUnfollow = async () => {
    if (!profile) return

    try {
      const result = await unfollow({ profile });
      if (result.isSuccess()) {
        setSuccessMessage('Successfully unfollowed the profile.');
        // Wait for transaction confirmation
        await result.value.waitForCompletion();
      } else {
        // Handle specific unfollow errors
        handleUnfollowError(result.error);
      }
    } catch (error) {
      setErrorMessage('An error occurred while trying to unfollow the profile.');
    }
  };

  // Function to handle specific follow errors
  const handleFollowError = (error: any) => {
    switch (error.name) {
      case 'BroadcastingError':
        setErrorMessage('There was an error broadcasting the transaction.');
        break;
      case 'PendingSigningRequestError':
        setErrorMessage('There is a pending signing request in your wallet.');
        break;
      case 'InsufficientAllowanceError':
        setErrorMessage(`You must approve the contract to spend at least: ${error.requestedAmount.asset.symbol} ${error.requestedAmount.toSignificantDigits(6)}`);
        break;
      case 'InsufficientFundsError':
        setErrorMessage(`You do not have enough funds to pay for this follow fee: ${error.requestedAmount.asset.symbol} ${error.requestedAmount.toSignificantDigits(6)}`);
        break;
      case 'WalletConnectionError':
        setErrorMessage('There was an error connecting to your wallet.');
        break;
      case 'PrematureFollowError':
        setErrorMessage('There is a pending unfollow request for this profile.');
        break;
      case 'UserRejectedError':
        // Optionally notify the user that they rejected the action
        break;
      default:
        setErrorMessage('An unknown error occurred.');
    }
  };

  // Function to handle specific unfollow errors
  const handleUnfollowError = (error: any) => {
    switch (error.name) {
      case 'BroadcastingError':
        setErrorMessage('There was an error broadcasting the transaction.');
        break;
      case 'PendingSigningRequestError':
        setErrorMessage('There is a pending signing request in your wallet.');
        break;
      case 'WalletConnectionError':
        setErrorMessage('There was an error connecting to your wallet.');
        break;
      case 'UserRejectedError':
        // Optionally notify the user that they rejected the action
        break;
      default:
        setErrorMessage('An unknown error occurred.');
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.primary.darker, 0.8),
          imgUrl: _userAbout.coverUrl,
        }),
        height: 1,
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Stack
        direction="column"
        sx={{
          zIndex: 10,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Avatar
          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`}
          alt={profile?.handle?.localName ?? ''}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        />

        <Stack direction='column'>
          <ListItemText
            sx={{
              mt: 3,
              textAlign: 'center',
            }}
            primary={profile?.handle?.localName ?? ''}
            secondary={profile?.id ?? ''}
            primaryTypographyProps={{
              typography: 'h4',
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              mb: 2,
              color: 'inherit',
              component: 'span',
              typography: 'body2',
              sx: { opacity: 0.48 },
            }}
          />
          {
            selectedProfile && profile?.id !== selectedProfile.id ? (
              <LoadingButton
                title={isFollowed ? "Unfollow" : "Follow"}
                variant={isFollowed ? "outlined" : "contained"}
                sx={{
                  mb: 5,
                  minWidth: 120,
                  backgroundColor: isFollowed ? '#24262A' : '#fff'
                }}
                onClick={isFollowed ? handleUnfollow : handleFollow}
                disabled={followLoading || unfollowLoading}
                loading={followLoading || unfollowLoading}
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </LoadingButton>
            ) : <></>
          }
        </Stack>
      </Stack>

      {/* Snackbar for error messages */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1000 }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar for success messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1000 }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
