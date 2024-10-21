import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// types
import { IUserProfileFollower } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useProfileFollowers } from '@lens-protocol/react';
import { Profile } from '@lens-protocol/api-bindings';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useAuth } from '../../hooks/use-auth';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';

// ----------------------------------------------------------------------

type Props = {
  profile: Profile;
};

const ProfileFollowers = ({ profile }: Props) => {
  const { data: followers, loading, error } = useProfileFollowers({
    of: profile.id
  });

  console.log('followers')
  console.log(followers)

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Followers
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
         {
           followers?.length ? (
             followers.map((follower) => (
               <FollowerItem profile={follower} />
             ))
           ) : (
             <Typography>No followers</Typography>
           )
         }
      </Box>
    </>
  );
}

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
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        p: (theme) => theme.spacing(3, 2, 3, 3),
      }}
      onClick={goToProfile}
    >
      <Avatar
        src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`}
        alt={profile?.handle?.localName ?? ''}
        sx={{ width: 48, height: 48, mr: 2 }}
      />

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

      {
        selectedProfile && profile?.id !== selectedProfile.id ? (
          <LoadingButton
            size="small"
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
    </Card>
  );
}

export default ProfileFollowers
