import { useState, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
// components
import { Profile } from '@lens-protocol/api-bindings';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useAuth } from '../../hooks/use-auth';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import Image from '../../components/image';

// ----------------------------------------------------------------------

type FollowerItemProps = {
  profile: Profile;
};

export const FollowerItem = ({ profile }: FollowerItemProps) => {
  const { selectedProfile } = useAuth();
  const [isFollowed, setIsFollowed] = useState(false);
  // State to handle error and success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Hooks for follow and unfollow actions
  const { execute: follow, error: followError, loading: followLoading } = useFollow();
  const { execute: unfollow, error: unfollowError, loading: unfollowLoading } = useUnfollow();
  const router = useRouter();

  const goToProfile = () => {
    router.push(paths.dashboard.user.root(`${profile.id}`))
  }

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
    <>
      <Box
        sx={{
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: 1,
          padding: 1,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'scale(1.03)' },
        }}
        onClick={goToProfile}
      >
        <Image
          src={profile?.metadata?.coverPicture?.optimized?.uri ?? `https://picsum.photos/seed/${profile?.id}/1920/820`}
          sx={{
            height: 120,
            opacity: 0.7,
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        />
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: 'pointer',
            mt: -3,
            backgroundColor: 'transparent',
            p: (theme) => theme.spacing(0, 2, 1, 2),
          }}
        >
          <Avatar
            src={(profile?.metadata?.picture as any)?.optimized?.uri ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`}
            alt={profile?.handle?.localName ?? ''}
            sx={{ width: 48, height: 48, mr: 2 }}
            variant="rounded"
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
              width: '100%',
            }}
          >
            <ListItemText
              primary={profile?.handle?.localName ?? ''}
              secondary={
                <>
                  {profile?.id !== selectedProfile?.id ? profile?.id : 'This is you!'}
                </>
              }
              primaryTypographyProps={{
                noWrap: true,
                typography: 'subtitle2',
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                noWrap: true,
                display: 'flex',
                component: 'span',
                alignItems: 'center',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />

            <LoadingButton
              size="small"
              title={isFollowed ? "Unfollow" : "Follow"}
              variant={isFollowed ? "outlined" : "contained"}
              sx={{
                minWidth: 120,
                backgroundColor: isFollowed ? '#24262A' : '#fff'
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (isFollowed) {
                  handleUnfollow();
                } else {
                  handleFollow();
                }
              }}
              disabled={followLoading || unfollowLoading || !selectedProfile || profile?.id === selectedProfile?.id}
              loading={followLoading || unfollowLoading}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </LoadingButton>

          </Box>
        </Card>
      </Box>

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
    </>
  );
}

export default FollowerItem
