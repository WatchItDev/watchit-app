import { useState, useEffect, PropsWithChildren } from 'react';
// components
import Iconify from '@src/components/iconify';
//
// eslint-disable-next-line import/no-extraneous-dependencies
import { appId, PublicationType, useFollow, usePublications, useUnfollow } from '@lens-protocol/react-web';
import { useTheme } from '@mui/material/styles';
import { Profile } from '@lens-protocol/api-bindings';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { useAuth } from '../../hooks/use-auth';
import ProfileCover from './profile-cover';
import { truncateAddress } from '../../utils/wallet';
import CopyableText from '../../components/copyableText/copyableText';
import { UpdateModal } from '@src/components/updateModal';

// ----------------------------------------------------------------------

const urlToShare = "https://watchit.movie";

const shareLinks = [
  {
    icon: 'mingcute:social-x-line',
    label: 'X',
    url: `https://x.com/share/?url=${encodeURIComponent(urlToShare)}&text=Watchit%20Movie&hashtags=Watchit`,
  },
  {
    icon: 'mdi:facebook',
    label: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`,
  },
  {
    icon: 'mdi:telegram',
    label: 'Telegram',
    url: `https://telegram.me/share/?url=${encodeURIComponent(urlToShare)}&title=Watchit`,
  }
];

const socialMedia = [
  { key: 'twitter', icon: 'mingcute:social-x-line' },
  { key: 'facebook', icon: 'mdi:facebook' },
  { key: 'instagram', icon: 'mdi:instagram' },
];


// ----------------------------------------------------------------------

interface ProfileHeaderProps {
  profile: Profile;
}

interface SocialMediaUrls {
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

// ----------------------------------------------------------------------

const ProfileHeader = ({ profile, children }: PropsWithChildren<ProfileHeaderProps>) => {
  usePublications({
    where: {
      from: [...(profile?.id ? [profile.id] : [])],
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });

  const theme = useTheme();
  const { selectedProfile } = useAuth();
  const [isFollowed, setIsFollowed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  // State to handle error and success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
    setIsFollowed(!!profile?.operations?.isFollowedByMe?.value);
  }, [selectedProfile, profile]);

  const socialMediaUrls: SocialMediaUrls =
    profile?.metadata?.attributes?.reduce((acc: SocialMediaUrls, attr) => {
      if (['twitter', 'facebook', 'instagram'].includes(attr.key)) {
        acc[attr.key as keyof SocialMediaUrls] = attr.value;
      }
      return acc;
    }, {} as SocialMediaUrls) || {};

  // const updateMetadata = async () => {
  //   if (!selectedProfile) return
  //
  //   updateProfileMetadata({
  //     username: 'jacob',
  //     name: 'jacob',
  //     nickname: 'jacob',
  //     bio: 'test',
  //   }, selectedProfile)
  // };

  // Function to handle following a profile
  const handleFollow = async () => {
    if (!profile) return;

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
    if (!profile) return;

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
        setErrorMessage(
          `You must approve the contract to spend at least: ${
            error.requestedAmount.asset.symbol
          } ${error.requestedAmount.toSignificantDigits(6)}`
        );
        break;
      case 'InsufficientFundsError':
        setErrorMessage(
          `You do not have enough funds to pay for this follow fee: ${
            error.requestedAmount.asset.symbol
          } ${error.requestedAmount.toSignificantDigits(6)}`
        );
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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlToShare);
      setSuccessMessage('Link copied to clipboard!');
    } catch (err) {
      setErrorMessage('Failed to copy link.');
    }
  };

  console.log('profile');
  console.log(profile);

  return (
    <>
      <Box sx={{ my: 3 }}>
        <ProfileCover profile={profile} />

        <Stack
          direction="row"
          sx={{
            zIndex: 10,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="column"
            sx={{
              zIndex: 10,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginTop: { xs: '-32px', md: '-64px' },
              ml: 4,
            }}
          >
            <Stack direction="row">
              <Avatar
                src={
                  (profile?.metadata?.picture as any)?.optimized?.uri ??
                  `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`
                }
                alt={profile?.handle?.localName ?? ''}
                variant="rounded"
                sx={{
                  width: { xs: 64, md: 128 },
                  height: { xs: 64, md: 128 },
                  border: `solid 2px ${theme.palette.common.white}`,
                }}
              />
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 11, ml: 2 }}>
                {socialMedia.map(
                  ({ key, icon }) =>
                    socialMediaUrls[key as keyof SocialMediaUrls] && (
                      <Button
                        key={key}
                        component="a"
                        href={socialMediaUrls[key as keyof SocialMediaUrls]}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          p: 1,
                          width: 40,
                          height: 40,
                          minWidth: '40px',
                        }}
                      >
                        <Iconify icon={icon} width={20} />
                      </Button>
                    )
                )}
              </Stack>
            </Stack>

            <Stack direction="column" sx={{ width: '100%' }}>
              <Box sx={{ mt: 2, width: '80%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    mt: 0,
                    mb: 1,
                  }}
                >
                  <Typography variant="h4" color="text.primary">
                    {profile?.metadata?.displayName ?? ''}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      opacity: 0.48,
                      ml: 2,
                      mb: 0.4,
                    }}
                  >
                    {profile?.handle?.localName ?? ''}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    mt: 0,
                    mb: 2,
                    opacity: 0.7,
                    minWidth: '400px',
                  }}
                >
                  {profile?.metadata?.bio ?? ''}
                </Typography>
              </Box>
              <Stack direction="row" sx={{ width: '100%', mb: 5, gap: 2 }}>
                <LoadingButton
                  title={isFollowed ? 'Unsubscribe' : 'Subscribe'}
                  variant={isFollowed ? 'outlined' : 'contained'}
                  sx={{
                    minWidth: 120,
                    backgroundColor: isFollowed ? '#24262A' : '#fff',
                  }}
                  onClick={isFollowed ? handleUnfollow : handleFollow}
                  disabled={followLoading || unfollowLoading || profile?.id === selectedProfile?.id}
                  loading={followLoading || unfollowLoading}
                >
                  {isFollowed ? 'Unsubscribe' : 'Subscribe'}
                </LoadingButton>
                <Button
                  size="medium"
                  variant="outlined"
                  sx={{ p: 1, minWidth: '44px' }}
                  onClick={handlePopoverOpen}
                >
                  <Iconify icon="ion:share-social-outline" width={20} />
                </Button>
                {selectedProfile && profile?.id === selectedProfile?.id && (
                  <Button
                    variant="outlined"
                    sx={{
                      p: 1,
                      minWidth: '44px',
                      backgroundColor: 'transparent',
                    }}
                    onClick={() => setIsUpdateModalOpen(true)}
                  >
                    <Iconify icon="mingcute:user-edit-line" width={20} />
                  </Button>
                )}

                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  PaperProps={{
                    sx: {
                      background: 'linear-gradient(90deg, #1C1C1E, #2C2C2E)',
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      mt: 1.5,
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight="bold" align="center" gutterBottom>
                    Share link to this page
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    {shareLinks.map((item) => (
                      <Stack
                        key={item.label}
                        direction="column"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          component="a"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            p: 1,
                            mb: 2,
                            width: 40,
                            height: 40,
                            minWidth: '40px',
                          }}
                        >
                          <Iconify icon={item.icon} width={20} />
                        </Button>
                        <Typography variant="subtitle2" fontSize={10} color="text.secondary">
                          {item.label}
                        </Typography>
                      </Stack>
                    ))}
                    <Stack direction="column" alignItems="center" justifyContent="center">
                      <Button
                        onClick={handleCopy}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          p: 1,
                          mb: 2,
                          width: 40,
                          height: 40,
                          minWidth: '40px',
                        }}
                      >
                        <Iconify icon="mdi:link-variant" width={20} />
                      </Button>
                      <Typography variant="subtitle2" fontSize={10} color="text.secondary">
                        Copy
                      </Typography>
                    </Stack>
                  </Stack>
                </Popover>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            gap={2}
            sx={{
              zIndex: 10,
              p: 2,
              alignItems: 'flex-start',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 2,
              width: '328px',
              marginTop: 4,
              marginBottom: 3,
            }}
          >
            <Stack
              direction="row"
              sx={{
                zIndex: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography color="text.secondary">Lens id</Typography>
              <CopyableText label={`${profile?.id}`} text={`${profile?.id}`} />
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />
            <Stack
              direction="row"
              sx={{
                zIndex: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography color="text.secondary">Address</Typography>
              <CopyableText
                label={truncateAddress(`${profile?.ownedBy?.address}`)}
                text={`${profile?.ownedBy?.address}`}
              />
            </Stack>
          </Stack>
        </Stack>

        {children}
      </Box>

      <UpdateModal open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />

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
};

export default ProfileHeader
