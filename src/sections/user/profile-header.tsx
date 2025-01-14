// REACT IMPORTS
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

// Redux
import { openLoginModal } from '@redux/auth';
import { useDispatch, useSelector } from 'react-redux';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Profile } from '@lens-protocol/api-bindings';
import CircularProgress from '@mui/material/CircularProgress';

// LENS IMPORTS
import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';

// VIEM IMPORTS
import { Address } from 'viem';

// ICONS IMPORTS
import { IconDots, IconRosetteDiscountCheckFilled } from '@tabler/icons-react';

// LOCAL IMPORTS
import ProfileCover from './profile-cover';
import Iconify from '@src/components/iconify';
import { truncateAddress } from '@src/utils/wallet';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { UpdateModal } from '@src/components/update-modal';
import { useHasAccess } from '@src/hooks/use-has-access.ts';
import { CopyableText } from '@src/components/copyable-text/index.ts';
import { ReportProfileModal } from '@src/components/report-profile-modal.tsx';
import { useIsPolicyAuthorized } from '@src/hooks/use-is-policy-authorized.ts';
import { SubscribeProfileModal } from '@src/components/subscribe-profile-modal.tsx';
import { ActivateSubscriptionProfileModal } from '@src/components/activate-subscription-profile-modal.tsx';
import FollowUnfollowButton from '@src/components/follow-unfollow-button.tsx';
import { randomColors } from '@src/components/poster/variants/poster-latest-content.tsx';
import { OpenableText } from '@src/components/openable-text/index.ts';
import { useGetPolicyAttestation } from '@src/hooks/use-get-policy-attestation.ts';

// Notifcations
import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { SUCCESS } from '@notifications/success.ts';
import { ERRORS } from '@notifications/errors.ts';

// ----------------------------------------------------------------------

const urlToShare = 'https://app.watchit.movie/profileId';
const urlAttestationBase = 'https://polygon-amoy.easscan.org/attestation/view/';

// const GeoAddress = '0xEFBBD14082cF2FbCf5Badc7ee619F0f4e36D0A5B'

const shareLinks = [
  {
    icon: 'mingcute:social-x-line',
    label: 'X',
    url: `https://x.com/share/?url=${encodeURIComponent(urlToShare)}&text=Visit%20my%20profile%20in%20Watchit&hashtags=Watchit`,
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
  },
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

const prependProfileIdToUrl = (url: string, profileId: string) => {
  return url.replace('profileId', 'profile/' + profileId);
};

// ----------------------------------------------------------------------

const ProfileHeader = ({
  profile: profileData,
  children,
}: PropsWithChildren<ProfileHeaderProps>) => {
  const dispatch = useDispatch();
  const navRef = useRef(null);
  const navRefSocial = useRef(null);
  const navRefSettings = useRef(null);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openTooltipShare, setOpenTooltipShare] = useState(false);
  const [openTooltipSettings, setOpenTooltipSettings] = useState(false);

  const theme = useTheme();
  const sessionData = useSelector((state: any) => state.auth.session);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);
  const open = Boolean(anchorEl);
  const openMenu = Boolean(menuAnchorEl);
  const profile =
    sessionData && sessionData?.profile?.id === profileData?.id ? sessionData.profile : profileData;

  // State to handle error and success messages
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const {
    attestation,
    loading: attestationLoading,
    refetch: refetchAttestation,
  } = useGetPolicyAttestation(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    sessionData?.profile?.ownedBy?.address as Address,
    profile?.ownedBy?.address as Address
  );
  const {
    hasAccess,
    loading: accessLoading,
    fetching: accessFetchingLoading,
    refetch: refetchAccess,
  } = useHasAccess(profile?.ownedBy?.address as Address);
  const { isAuthorized, loading: authorizedLoading } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    profile?.ownedBy?.address as Address
  );

  const attestationAddress = `0x${BigInt(attestation ?? '').toString(16)}`;

  const handleClose = useCallback(() => {
    setOpenTooltip(false);
  }, []);

  useEffect(() => {
    if (open) {
      handleClose();
    }
  }, [handleClose, open]);

  const handleOpen = useCallback(() => {
    setOpenTooltip(true);
  }, []);

  const handleOpenShare = useCallback(() => {
    setOpenTooltipShare(true);
  }, []);

  const handleCloseShare = useCallback(() => {
    setOpenTooltipShare(false);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setOpenTooltipSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setOpenTooltipSettings(false);
  }, []);

  usePublications({
    where: {
      from: [...(profile?.id ? [profile.id] : [])],
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });

  const socialMediaUrls: SocialMediaUrls =
    profile?.metadata?.attributes?.reduce((acc: SocialMediaUrls, attr: any) => {
      if (['twitter', 'facebook', 'instagram'].includes(attr.key)) {
        acc[attr.key as keyof SocialMediaUrls] = attr.value;
      }
      return acc;
    }, {} as SocialMediaUrls) || {};

  // Function to handle following a profile
  const onSubscribe = async () => {
    refetchAccess();
    refetchAttestation();
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        urlToShare.replace('profileId', 'profile/' + profile?.id)
      );
      notifySuccess(SUCCESS.LINK_COPIED_TO_CLIPBOARD);
    } catch (err) {
      notifyError(ERRORS.LINK_COPIED_ERROR);
    }
  };

  const handleSubscription = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    if (!hasAccess) setOpenSubscribeModal(true);
  };

  const profileImage = (profile?.metadata?.picture as any)?.optimized?.uri;

  return (
    <>
      <Box sx={{ my: 3, position: 'relative' }}>
        <ProfileCover profile={profile} sx={{ height: { xs: 200, md: 300 }}} />

        {sessionData?.authenticated ? (
          <Button
            variant="text"
            sx={{
              borderColor: '#FFFFFF',
              color: '#FFFFFF',
              height: '40px',
              minWidth: '40px',
              position: 'absolute',
              zIndex: 1,
              right: 5,
              top: 5,
            }}
            onClick={(event) => setMenuAnchorEl(event.currentTarget)}
          >
            <IconDots size={22} color="#FFFFFF" />
          </Button>
        ) : (
          <></>
        )}

        <Popover
          open={openMenu}
          anchorEl={menuAnchorEl}
          onClose={() => setMenuAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{
            sx: {
              background: 'linear-gradient(90deg, #1C1C1E, #2C2C2E)',
              borderRadius: 1,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              ml: -3,
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <Stack direction="column" spacing={0} justifyContent="center">
            <MenuItem
              sx={{ p: 1 }}
              onClick={() => {
                setOpenReportModal(true);
                setMenuAnchorEl(null);
              }}
            >
              Report
            </MenuItem>
          </Stack>
        </Popover>

        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
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
              width: '100%',
              marginTop: { xs: '-48px', md: '-64px' },
              ml: {
                xs: 4,
                md: 4,
              },
            }}
          >
            <Stack
              direction="row"
              sx={{
                ml: {
                  xs: 0,
                  sm: 0,
                  md: 0,
                },
              }}
            >
              <Avatar
                src={
                  !!profileImage
                    ? profileImage
                    : `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`
                }
                alt={profile?.handle?.localName ?? ''}
                variant="rounded"
                sx={{
                  width: { xs: 96, md: 128 },
                  height: { xs: 96, md: 128 },
                  border: `solid 2px ${theme.palette.common.white}`,
                }}
              />
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{
                  mt: {
                    xs: 7,
                    sm: 7,
                    md: 11,
                  },
                  ml: 2,
                }}
              >
                {socialMedia.map(
                  ({ key, icon }) =>
                    socialMediaUrls[key as keyof SocialMediaUrls] && (
                      <Button
                        key={`link-${key}`}
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
                <Button
                  onMouseEnter={handleOpenShare}
                  onMouseLeave={handleCloseShare}
                  ref={navRefSocial}
                  size="medium"
                  variant="outlined"
                  sx={{ p: 1, minWidth: '44px' }}
                  onClick={handlePopoverOpen}
                >
                  <Iconify icon="ion:share-social-outline" width={20} />
                </Button>

                <Popover
                  open={openTooltipShare}
                  anchorEl={navRefSocial.current}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  slotProps={{
                    paper: {
                      onMouseEnter: handleOpenShare,
                      onMouseLeave: handleCloseShare,
                      sx: {
                        mt: 6,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        padding: '8px 20px',
                        ...(open && {
                          pointerEvents: 'auto',
                        }),
                      },
                    },
                  }}
                  sx={{
                    pointerEvents: 'none',
                  }}
                >
                  <Typography>Share Watchit on your social</Typography>
                </Popover>
              </Stack>
            </Stack>

            <Stack direction="column" sx={{ width: '100%', maxWidth: { xs: 'calc(100% - 2rem)', md: '100%' } }}>
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
                    minWidth: { xs: 'auto', md: '400px' },
                  }}
                >
                  {profile?.metadata?.bio ?? ''}
                </Typography>
              </Box>
              <Stack direction="row" sx={{ width: '100%', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                {authorizedLoading && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      maxWidth: '100%',
                      flexWrap: 'wrap',
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                  </Box>
                )}

                {isAuthorized && !authorizedLoading && profile?.id !== sessionData?.profile?.id && (
                  <LoadingButton
                    title={hasAccess ? 'Joined!' : 'Join'}
                    variant={hasAccess ? 'outlined' : 'contained'}
                    sx={{
                      minWidth: 120,
                      backgroundColor: hasAccess ? '#24262A' : '#fff',
                    }}
                    onClick={handleSubscription}
                    disabled={accessLoading || hasAccess || accessFetchingLoading}
                    loading={accessLoading || accessFetchingLoading}
                  >
                    {hasAccess ? 'Joined!' : 'Join'}
                  </LoadingButton>
                )}

                {sessionData?.authenticated && sessionData?.profile?.id === profile?.id ? (
                  <>
                    <Button
                      onMouseEnter={handleOpenSettings}
                      onMouseLeave={handleCloseSettings}
                      ref={navRefSettings}
                      size="medium"
                      variant="outlined"
                      sx={{ p: 1, minWidth: '44px' }}
                      onClick={() => setIsActivateModalOpen(true)}
                    >
                      <Iconify icon="ion:logo-usd" width={20} />
                    </Button>

                    <Popover
                      open={openTooltipSettings}
                      anchorEl={navRefSettings.current}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      slotProps={{
                        paper: {
                          onMouseEnter: handleOpenSettings,
                          onMouseLeave: handleCloseSettings,
                          sx: {
                            mt: 6,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: '8px 20px',
                            ...(open && {
                              pointerEvents: 'auto',
                            }),
                          },
                        },
                      }}
                      sx={{
                        pointerEvents: 'none',
                      }}
                    >
                      <Typography>Set joining pricing</Typography>
                    </Popover>
                  </>
                ) : (
                  <></>
                )}

                {profile?.id !== sessionData?.profile?.id && (
                  <FollowUnfollowButton profileId={profile?.id} />
                )}

                {sessionData?.profile && profile?.id === sessionData?.profile?.id && (
                  <>
                    <Button
                      onMouseEnter={handleOpen}
                      onMouseLeave={handleClose}
                      ref={navRef}
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
                    <Popover
                      open={openTooltip}
                      anchorEl={navRef.current}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      slotProps={{
                        paper: {
                          onMouseEnter: handleOpen,
                          onMouseLeave: handleClose,
                          sx: {
                            mt: 6,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: '8px 20px',
                            ...(open && {
                              pointerEvents: 'auto',
                            }),
                          },
                        },
                      }}
                      sx={{
                        pointerEvents: 'none',
                      }}
                    >
                      <Typography>Update your profile information</Typography>
                    </Popover>
                  </>
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
                    {shareLinks.map((item, index) => (
                      <Stack
                        key={`share-link-item-${index}`}
                        direction="column"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          component="a"
                          href={prependProfileIdToUrl(item.url, profile?.id)}
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
              width: {
                xs: '100%',
                md: '328px',
              },
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
              <Typography color="text.secondary">Lens ID</Typography>
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
            {isAuthorized &&
              !authorizedLoading &&
              attestation &&
              !attestationLoading &&
              hasAccess &&
              !accessLoading &&
              profile?.id !== sessionData?.profile?.id && (
                <>
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
                    <Typography color="text.secondary">License</Typography>
                    <OpenableText
                      label={truncateAddress(attestationAddress)}
                      url={`${urlAttestationBase}${attestationAddress}`}
                    />
                  </Stack>
                </>
              )}
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />
            <Stack
              direction="column"
              sx={{
                zIndex: 10,
                width: '100%',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <Typography color="text.secondary">Distribution Partners</Typography>
              <Box
                gridTemplateColumns={{
                  xs: 'repeat(3, 1fr)',
                }}
                sx={{
                  overflow: 'hidden',
                  display: 'grid',
                  gap: 1,
                  mt: 1,
                }}
              >
                {['Watchit'].map((partner, index) => (
                  <StyledBoxGradient
                    key={`partner-${index}`}
                    color1={randomColors[randomColors.length - index]}
                    color2={randomColors[index]}
                  >
                    <Typography style={{ marginRight: 5, fontWeight: 'bold' }} variant="caption">
                      {partner}
                    </Typography>
                    <IconRosetteDiscountCheckFilled />
                  </StyledBoxGradient>
                ))}
              </Box>
            </Stack>
          </Stack>
        </Stack>

        {children}
      </Box>

      <UpdateModal open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />

      <SubscribeProfileModal
        isOpen={openSubscribeModal}
        onClose={() => setOpenSubscribeModal(false)}
        onSubscribe={onSubscribe}
        profile={profile}
      />

      <ActivateSubscriptionProfileModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
      />

      <ReportProfileModal
        profile={profile}
        isOpen={openReportModal}
        onClose={() => setOpenReportModal(false)}
      />
    </>
  );
};

export default ProfileHeader;

const StyledBoxGradient = styled(Box)<{ color1?: string; color2?: string }>(({
  theme,
  color1,
  color2,
}) => {
  const defaultColor1 = theme.palette.primary.main;
  const defaultColor2 = theme.palette.secondary.main;

  return {
    background: `linear-gradient(300deg, ${color1 || defaultColor1} 0%, ${color2 || defaultColor2} 25%, ${color1 || defaultColor1} 50%, ${color2 || defaultColor2} 75%, ${color1 || defaultColor1} 100%)`,
    backgroundSize: '400%',
    animation: 'gradientShift 20s infinite',
    padding: '4px 8px',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    gap: '3px',
    '@keyframes gradientShift': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
  };
});
