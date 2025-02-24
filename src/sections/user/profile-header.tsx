import { PropsWithChildren } from 'react'
import { Profile } from '@lens-protocol/api-bindings'
import { appId, PublicationType, usePublications } from '@lens-protocol/react-web'
import { useSelector } from 'react-redux'
import { Address } from 'viem'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import ProfileCover from './profile-cover'
import ProfileWrapper from './profile-wrapper'
import FollowUnfollowButton from '@src/components/follow-unfollow-button.tsx'
import { GLOBAL_CONSTANTS } from '@src/config-global.ts'
import { useGetPolicyAttestation } from '@src/hooks/use-get-policy-attestation.ts'
import { useHasAccess } from '@src/hooks/use-has-access.ts'
import { useIsPolicyAuthorized } from '@src/hooks/use-is-policy-authorized.ts'
import ProfileJoin from "@src/sections/user/profile-join.tsx"
import ProfileReport from '@src/sections/user/profile-report.tsx'
import ProfileRightSidebar from "@src/sections/user/profile-right-sidebar.tsx"
import ProfileToolbar from "@src/sections/user/profile-toolbar.tsx"
import ProfileUserInfo from "@src/sections/user/profile-user-info.tsx"

export interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader = ({
  profile: profileData,
  children,
}: PropsWithChildren<ProfileHeaderProps>) => {
  const sessionData = useSelector((state: any) => state.auth.session)

  const profile =
    sessionData && sessionData?.profile?.id === profileData?.id ? sessionData.profile : profileData

  const {
    attestation,
    loading: attestationLoading,
    refetch: refetchAttestation,
  } = useGetPolicyAttestation(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    sessionData?.profile?.ownedBy?.address as Address,
    profile?.ownedBy?.address as Address
  )
  const {
    hasAccess,
    loading: accessLoading,
    fetching: accessFetchingLoading,
    refetch: refetchAccess,
  } = useHasAccess(profile?.ownedBy?.address as Address)
  const { isAuthorized, loading: authorizedLoading } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    profile?.ownedBy?.address as Address
  )

  usePublications({
    where: {
      from: [...(profile?.id ? [profile.id] : [])],
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  })

  // Function to handle following a profile
  const onSubscribe = async () => {
    refetchAccess()
    refetchAttestation()
  }

  const profileImage = (profile?.metadata?.picture as any)?.optimized?.uri

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

            {profile?.id !== sessionData?.profile?.id && (
              <FollowUnfollowButton profileId={profile?.id} />
            )}

          </Stack>
        </Stack>
      </ProfileWrapper>
      {children}
    </Box>
  )
}

export default ProfileHeader
