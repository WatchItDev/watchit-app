import { useEffect, useState } from 'react'
import { useLazyProfile, useProfileFollowers, useProfileFollowing } from '@lens-protocol/react'
import { appId, ProfileId, PublicationType, usePublications } from '@lens-protocol/react-web'
import { setFollowers, setFollowings } from '@redux/followers'
import { useSelector, useDispatch } from 'react-redux'
import { Address } from 'viem'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs, { tabsClasses } from '@mui/material/Tabs'
import Label from '../../../components/label'
import ProfileFollowers from '../profile-followers'
import ProfileFollowing from '../profile-following'
import ProfileHeader from '../profile-header'
import ProfileHome from '../profile-home'
import { LoadingScreen } from '@src/components/loading-screen'
import { useSettingsContext } from '@src/components/settings'

import { GLOBAL_CONSTANTS } from '@src/config-global.ts'
import { useIsPolicyAuthorized } from '@src/hooks/use-is-policy-authorized.ts'
import useReferrals from "@src/hooks/use-referrals.ts"
// @ts-ignore
import { RootState } from '@src/redux/store'
import ProfileReferrals from "@src/sections/user/profile-referrals.tsx"
import {filterHiddenProfiles} from "@src/utils/profile.ts"

const TABS = [
  { value: 'publications', label: 'Publications' },
  { value: 'followers', label: 'Followers' },
  { value: 'following', label: 'Following' },
  { value: 'referrals', label: 'Referrals' },
]

const UserProfileView = ({ id }: any) => {
  const dispatch = useDispatch()
  const settings = useSettingsContext()
  const [currentTab, setCurrentTab] = useState('publications')
  const sessionData = useSelector((state: any) => state.auth.session)
  const { called, data: profile, loading: loadingProfile, execute } = useLazyProfile()
  const { data: publications, loading: loadingPublications } = usePublications({
    where: {
      from: profile?.id ? [profile.id] : [],
      publicationTypes: [PublicationType.Post],
      metadata: { publishedOn: [appId('watchit')] },
    },
  })
  const { isAuthorized, loading: authorizedLoading } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    profile?.ownedBy?.address as Address
  )

  const { invitations: referrals, fetchInvitations, loading: loadingReferrals } = useReferrals()

  const { data: followers } = useProfileFollowers({
    // @ts-ignore
    of: profile?.id,
  })

  const { data: following } = useProfileFollowing({
    // @ts-ignore
    for: profile?.id,
  })

  useEffect(() => {
    (async () => {
      if (id !== profile?.id || !called) await execute({ forProfileId: id as ProfileId })
    })()
  }, [profile?.id, id])

  useEffect(() => {
    if (profile) {
      dispatch(setFollowers(filterHiddenProfiles(followers) ?? []))
    }
  }, [profile, followers, dispatch])

  useEffect(() => {
    if (profile) {
      dispatch(setFollowings(filterHiddenProfiles(following) ?? []))
    }
  }, [profile, following, dispatch])

  // Call the fetchInvitations function
  useEffect(() => {
    if (profile) {
      fetchInvitations(profile.id)
    }
  }, [profile])

  const followersStore = useSelector((state: RootState) => state.followers.followers)
  const followingsStore = useSelector((state: RootState) => state.followers.followings)

  const counts: any = {
    publications: publications?.length ?? 0,
    followers: followersStore.length ?? 0,
    following: followingsStore.length ?? 0,
    referrals: referrals?.length ?? 0,
  }

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue)
  }

  const handleUpdateProfile = () => {
    execute({ forProfileId: id as ProfileId })
  }

  const tabsWithCounts = TABS.filter((tab) => {
    return !(tab.value === 'referrals' && sessionData?.profile?.id !== id)
  }).map((tab: any) => ({
    ...tab,
    key: tab.value,
    count: counts[tab.value],
  }))

  if (loadingProfile || loadingPublications) return (
    <LoadingScreen />
  )

  const showSubscriptionAlert =
    sessionData?.authenticated &&
    sessionData?.profile?.id === profile?.id &&
    (publications?.length ?? 0) >= 1 &&
    !isAuthorized &&
    !authorizedLoading

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ overflowX: 'hidden' }}>
      {showSubscriptionAlert && (
        <Alert severity="warning" sx={{ mt: 2, mb: -1 }}>
          Set your subscription prices so users can access your content. Click 'Set Joining Prices' next to your profile picture.
        </Alert>
      )}
      <ProfileHeader profile={profile as any}>
        <Tabs
          key={`tabs-${profile?.id}`}
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            zIndex: 9,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            [`& .${tabsClasses.flexContainer}`]: { justifyContent: 'flex-start', px: 0 },
            [`& .${tabsClasses.scroller}`]: { display: 'flex', justifyContent: {xs: 'flex-start', sm: 'center'} },
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.MuiTabs-scrollButtons.Mui-disabled': { display: 'none' },
              '&:first-of-type': { display: currentTab === 'publications' ? 'none' : 'flex' },
            },
          }}
        >
          {tabsWithCounts.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={<TabLabel label={tab.label} count={tab.count} />}
            />
          ))}
        </Tabs>
      </ProfileHeader>

      {currentTab === 'publications' && profile && (
        <ProfileHome
          publications={publications}
          noPaddings={true}
          scrollable={false}
          initialRows={3}
          rowsIncrement={2}
        />
      )}
      {currentTab === 'followers' && profile && (<ProfileFollowers onActionFinished={handleUpdateProfile} />)}
      {currentTab === 'following' && profile && <ProfileFollowing />}
      {currentTab === 'referrals' && sessionData?.profile?.id === id && <ProfileReferrals referrals={referrals} loading={loadingReferrals}  />}
    </Container>
  )
}

const TabLabel = ({ label, count }: any) => (
  <>
    {label}
    {count > 0 && (
      <Label sx={{ px: 0.75, ml: 1, fontSize: 12, color: 'text.secondary' }}>{count}</Label>
    )}
  </>
)

export default UserProfileView
