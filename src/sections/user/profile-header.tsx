// REACT IMPORTS
import { PropsWithChildren, useEffect } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Profile } from '@lens-protocol/api-bindings';
import CircularProgress from '@mui/material/CircularProgress';

// LENS IMPORTS
import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import ProfileCover from './profile-cover';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useHasAccess } from '@src/hooks/use-has-access.ts';
import { useIsPolicyAuthorized } from '@src/hooks/use-is-policy-authorized.ts';
import FollowUnfollowButton from '@src/components/follow-unfollow-button.tsx';
import { useGetPolicyAttestation } from '@src/hooks/use-get-policy-attestation.ts';

// Profile Components
import ProfileReport from '@src/sections/user/profile-report.tsx';
import ProfileRightSidebar from "@src/sections/user/profile-right-sidebar.tsx";
import ProfileJoin from "@src/sections/user/profile-join.tsx";
import ProfileUserInfo from "@src/sections/user/profile-user-info.tsx";
import ProfileWrapper from './profile-wrapper';
import ProfileToolbar from "@src/sections/user/profile-toolbar.tsx";
import ProfileTransfer from "@src/sections/user/profile-transfer.tsx";
import { Icon } from '@iconify/react';
import { Typography } from '@mui/material';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import { useGetSubscriptionCampaign } from '@src/hooks/use-get-subscription-campaign.ts';
import { useGetCampaignIsActive } from '@src/hooks/use-get-campaign-is-active.ts';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSponsoredAccessAgreement } from '@src/hooks/use-sponsored-access-agreement.ts';
import { openLoginModal } from '@redux/auth';

// ----------------------------------------------------------------------

export interface ProfileHeaderProps {
  profile: Profile;
}

// ----------------------------------------------------------------------

const ProfileHeader = ({
  profile: profileData,
  children,
}: PropsWithChildren<ProfileHeaderProps>) => {
  const sessionData = useSelector((state: any) => state.auth.session);

  const profile =
    sessionData && sessionData?.profile?.id === profileData?.id ? sessionData.profile : profileData;

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
  const { campaign, fetchSubscriptionCampaign } = useGetSubscriptionCampaign();
  const { sponsoredAccessAgreement, loading } = useSponsoredAccessAgreement();
  const { isActive, fetchIsActive } = useGetCampaignIsActive();
  const dispatch = useDispatch();

  usePublications({
    where: {
      from: [...(profile?.id ? [profile.id] : [])],
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });

  console.log('is active?')
  console.log(campaign)
  console.log(isActive)
  console.log(GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS)
  console.log(profile?.ownedBy?.address)

  useEffect(() => {
    fetchSubscriptionCampaign(profile?.ownedBy?.address);
  }, []);

  useEffect(() => {
    if (!campaign || !profile?.ownedBy?.address) return;

    fetchIsActive(campaign, profile?.ownedBy?.address);
  }, [campaign, profile?.ownedBy?.address]);

  // Function to handle following a profile
  const onSubscribe = async () => {
    refetchAccess();
    refetchAttestation();
  };

  const handleTrial = async () => {
    try {
      if (!sessionData?.authenticated) return dispatch(openLoginModal());

      await sponsoredAccessAgreement({
        holder: profile?.ownedBy?.address as Address,
        campaignAddress: campaign,
        policyAddress: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        parties: [sessionData?.address as Address],
        payload: '0x',
      });
    } catch (error) {
      console.error('Error en handleTrial:', error);
    }
  };

  const profileImage = (profile?.metadata?.picture as any)?.optimized?.uri;

  const RainbowEffect = loading ? NeonPaper : Box;

  return (
    <Box sx={{ my: 3, position: 'relative' }}>
      <ProfileCover profile={profile} sx={{ height: { xs: 200, md: 300 } }} />

      {sessionData?.authenticated ? <ProfileReport profile={profile} /> : <></>}

      <ProfileWrapper sidebar={<ProfileRightSidebar profile={profile} sidebarProps={{
        attestationLoading, attestation, hasAccess, accessLoading, isAuthorized, authorizedLoading
      }} />}>

        <ProfileToolbar profile={profile} profileImage={profileImage} />

        <Stack
          direction="column"
          sx={{ width: '100%', maxWidth: { xs: 'calc(100% - 2rem)', md: '100%' } }}
        >

          <ProfileUserInfo profile={profile} />

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

            {isAuthorized && !authorizedLoading && profile?.id !== sessionData?.profile?.id && <ProfileJoin profile={profile} profileJoinProps={{
              hasAccess, accessLoading, accessFetchingLoading, onSubscribe
            }} />}

            {
              isActive && isAuthorized && !authorizedLoading && (
                <RainbowEffect
                  borderRadius={'10px'}
                  animationSpeed={'3s'}
                  padding={'0'}
                  width={'auto'}
                  height={'38px !important'}
                >
                  <StyledBoxGradient onClick={handleTrial} loading={loading} sx={{ height: '100%', maxHeight: '38px' }}>
                    <Icon icon="ic:outline-try" width="18" height="18" />
                    <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: '700', ml: 1 }}>
                      Free trial
                    </Typography>
                  </StyledBoxGradient>
                </RainbowEffect>
              )
            }

            {profile?.id !== sessionData?.profile?.id && (
              <FollowUnfollowButton profileId={profile?.id} />
            )}
            {
              sessionData?.authenticated && profile?.id !== sessionData?.profile?.id && (
                  <ProfileTransfer profile={profile} />
              )
            }
          </Stack>
        </Stack>
      </ProfileWrapper>
      {children}
    </Box>
  );
};

export default ProfileHeader;


const StyledBoxGradient = styled(LoadingButton)(() => ({
  width: '100%',
  /* @TODO Choose one of this bg options*/
  background: `linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(70,31,97,1) 50%, rgba(149,17,238,1) 100%)`,
  /*background: `linear-gradient(90deg, rgba(6,20,205,1) 0%, rgba(42,1,146,1) 37%, rgba(155,119,201,1) 100%)`,*/
  /*background: `linear-gradient(90deg, rgba(36,2,0,1) 0%, rgba(146,22,1,1) 50%, rgba(255,85,0,1) 100%)`,*/
  /*background: `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 34%, rgba(0,212,255,1) 100%)`,*/
  backgroundSize: '400%',
  animation: 'gradientShift 10s infinite',
  padding: '16px',
  color: 'white',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));
