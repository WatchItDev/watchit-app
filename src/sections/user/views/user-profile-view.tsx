import {SyntheticEvent, useEffect, useState} from 'react'
// @mui
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

// components
import { useSettingsContext } from '@src/components/settings';
import ProfileHome from '../components/profile-home.tsx';
import ProfileFollowers from '../components/profile-followers.tsx';
import ProfileFollowing from '../components/profile-following.tsx';
import ProfileHeader from '../components/profile-header.tsx';
import Label from '../../../components/label';
import { LoadingScreen } from '@src/components/loading-screen';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/redux/store';
import { setFollowers, setFollowings } from '@redux/followers';
import ProfileReferrals from "@src/sections/user/components/profile-referrals.tsx";
import useReferrals from "@src/hooks/use-referrals.ts";
import Alert from '@mui/material/Alert';
import { useIsPolicyAuthorized } from '@src/hooks/protocol/use-is-policy-authorized.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { Address } from 'viem';
import { useAuth } from '@src/hooks/use-auth.ts';
import { TABS } from '../CONSTANTS.tsx';
import { UserProfileViewProps, CountsData, TabItemWithCount, TabLabelProps } from '../types.ts';
import {
  useGetPostsByAuthorLazyQuery,
  useGetUserFollowersLazyQuery, useGetUserFollowingLazyQuery,
  useGetUserLazyQuery,
} from '@src/graphql/generated/hooks.tsx';

// ----------------------------------------------------------------------

const UserProfileView = ({ id }: UserProfileViewProps) => {
  const dispatch = useDispatch();
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('publications');
  const { session, isAuthLoading } = useAuth();
  const { isAuthorized, loading: authorizedLoading } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    session?.address as Address
  );
  const [loadProfile, { data: profileData, loading: profileDataLoading }] = useGetUserLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [loadPublications, { data: profilePublications, loading: profilePublicationsLoading }] = useGetPostsByAuthorLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [loadFollowers, { data: profileFollowers, loading: profileFollowersLoading }] = useGetUserFollowersLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [loadFollowing, { data: profileFollowing, loading: profileFollowingLoading }] = useGetUserFollowingLazyQuery({ fetchPolicy: 'cache-and-network' });
  const { invitations: referrals, fetchInvitations, loading: loadingReferrals } = useReferrals();
  const followersStore = useSelector((state: RootState) => state.followers.followers);
  const followingsStore = useSelector((state: RootState) => state.followers.followings);

  const counts: CountsData = {
    publications: profilePublications?.getPostsByAuthor?.length ?? 0,
    followers: followersStore.length ?? 0,
    following: followingsStore.length ?? 0,
    referrals: referrals?.length ?? 0,
  };

  useEffect(() => {
    loadProfile({variables: { input: { address: id } }});
    loadPublications({variables: { author: id, limit: 50 }});
    loadFollowers({variables: { address: id, limit: 50 }});
    loadFollowing({variables: { address: id, limit: 50 }});
    fetchInvitations(id);
  }, [id]);

  useEffect(() => {
    if (profileFollowers?.getUserFollowers) {
      dispatch(setFollowers(profileFollowers?.getUserFollowers ?? []));
    }
  }, [profileFollowers]);

  useEffect(() => {
    if (profileFollowing?.getUserFollowing) {
      dispatch(setFollowings(profileFollowing?.getUserFollowing ?? []));
    }
  }, [profileFollowing]);

  const handleChangeTab = (_event: SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleUpdateProfile = () => {
    loadProfile({variables: { input: { address: id } }});
  };

  const tabsWithCounts = TABS.filter((tab) => {
    return !(tab.value === 'referrals' && session.address !== id);
  }).map((tab: Partial<TabItemWithCount>) => {
    const value: string = tab.value
    const count: number = counts[value] ?? 0
    return ({
      ...tab,
      key: value,
      count: count,
    })
  });

  if (profileDataLoading || profilePublicationsLoading || profileFollowersLoading || profileFollowingLoading || !profileData?.getUser) return (
    <LoadingScreen />
  );

  const showSubscriptionAlert =
    session?.authenticated &&
    session?.address === id &&
    (profilePublications?.getPostsByAuthor?.length ?? 0) >= 1 &&
    !isAuthLoading &&
    !isAuthorized &&
    !authorizedLoading;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ overflowX: 'hidden' }}>
      {showSubscriptionAlert && (
        <Alert severity="warning" sx={{ mt: 2, mb: -1 }}>
          Set your subscription prices so users can access your content. Click 'Set Joining Prices' next to your profile picture.
        </Alert>
      )}
      <ProfileHeader profile={profileData?.getUser}>
        <Tabs
          key={`tabs-${id}`}
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
              label={<TabLabel label={tab.label ?? ''} count={tab.count} />}
            />
          ))}
        </Tabs>
      </ProfileHeader>

      {currentTab === 'publications' && profileData?.getUser && (
        <ProfileHome
          publications={profilePublications?.getPostsByAuthor}
          scrollable={false}
          initialRows={3}
          rowsIncrement={2}
        />
      )}
      {currentTab === 'followers' && profileData?.getUser && (<ProfileFollowers onActionFinished={handleUpdateProfile} />)}
      {currentTab === 'following' && profileData?.getUser && <ProfileFollowing />}
      {currentTab === 'referrals' && session.address === id && <ProfileReferrals referrals={referrals} loading={loadingReferrals}  />}
    </Container>
  );
};

export const TabLabel = ({ label, count }: TabLabelProps) => (
  <>
    {label}
    {count > 0 && (
      <Label sx={{ px: 0.75, ml: 1, fontSize: 12, color: 'text.secondary' }}>{count}</Label>
    )}
  </>
);

export default UserProfileView;
