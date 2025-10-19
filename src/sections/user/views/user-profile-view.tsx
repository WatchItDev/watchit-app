import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
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
import ProfileReferrals from '@src/sections/user/components/profile-referrals.tsx';
import useReferrals from '@src/hooks/use-referrals.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { TABS } from '../CONSTANTS.tsx';
import {
  UserProfileViewProps,
  CountsData,
  TabItemWithCount,
  TabLabelProps,
} from '../types.ts';
import {
  useGetPostsLazyQuery,
  useGetUserFollowersLazyQuery,
  useGetUserFollowingLazyQuery,
  useGetUserLazyQuery,
} from '@src/graphql/generated/hooks.tsx';
import type { AppUser } from '@src/types/app-user.ts';
import { mapUserToAppUser } from '@src/types/app-user.ts';
import { UserProfileViewSkeleton } from '@src/sections/user/views/user-profile-view.skeleton.tsx';
import { LoadingFade } from '@src/components/LoadingFade.tsx';

// ----------------------------------------------------------------------

const UserProfileView = ({ id }: UserProfileViewProps) => {
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('publications');
  const { session } = useAuth();
  const [loadProfile, { data: profileData, loading: loadingProfile }] =
    useGetUserLazyQuery();
  const [loadPosts, { data: postsData, loading: postsLoading }] =
    useGetPostsLazyQuery();
  const [loadFollowers, { data: followersData, loading: followersLoading }] =
    useGetUserFollowersLazyQuery();
  const [loadFollowing, { data: followingData, loading: followingLoading }] =
    useGetUserFollowingLazyQuery();
  const {
    invitations: referrals,
    fetchInvitations,
    loading: loadingReferrals,
  } = useReferrals();
  const loading = loadingProfile || !profileData?.getUser;
  const profile = useMemo(() => mapUserToAppUser(profileData?.getUser), [profileData?.getUser]);

  const publications = postsData?.getPosts ?? [];
  const followersList = useMemo(
    () => (followersData?.getUserFollowers ?? []).map(mapUserToAppUser).filter(Boolean) as AppUser[],
    [followersData?.getUserFollowers],
  );
  const followingList = useMemo(
    () => (followingData?.getUserFollowing ?? []).map(mapUserToAppUser).filter(Boolean) as AppUser[],
    [followingData?.getUserFollowing],
  );

  const publicationCount = publications.length > 0 ? publications.length : profile?.publicationsCount ?? 0;
  const followersCount = followersList.length > 0 ? followersList.length : profile?.followersCount ?? 0;
  const followingCount = followingList.length > 0 ? followingList.length : profile?.followingCount ?? 0;
  const referralsCount = referrals?.length ?? 0;

  const counts: CountsData = useMemo(
    () => ({
      publications: publicationCount,
      followers: followersCount,
      following: followingCount,
      referrals: referralsCount,
    }),
    [publicationCount, followersCount, followingCount, referralsCount],
  );

  useEffect(() => {
    loadProfile({ variables: { input: { address: id } } });
    fetchInvitations(id);
  }, [id, loadProfile, fetchInvitations]);

  useEffect(() => {
    if (!profile?.id) return;
    loadPosts({ variables: { input: { userId: profile.id }, getPostsPage2: { limit: 20 } } });
  }, [profile?.id, loadPosts]);

  useEffect(() => {
    if (currentTab !== 'followers' || !profile?.address) return;
    loadFollowers({ variables: { address: profile.address, limit: 50 } });
  }, [currentTab, profile?.address, loadFollowers]);

  useEffect(() => {
    if (currentTab !== 'following' || !profile?.address) return;
    loadFollowing({ variables: { address: profile.address, limit: 50 } });
  }, [currentTab, profile?.address, loadFollowing]);

  const tabsWithCounts: TabItemWithCount[] = TABS.filter(
    (tab) => !(tab.value === 'referrals' && session.address !== id),
  ).map((tab) => ({
    ...tab,
    key: tab.value,
    count: counts[tab.value as keyof CountsData] ?? 0,
  }));

  const handleActionFinish = () => {
    if (!profile?.address) return;
    void loadFollowers({ variables: { address: profile.address, limit: 50 }, fetchPolicy: 'network-only' });
    void loadFollowing({ variables: { address: profile.address, limit: 50 }, fetchPolicy: 'network-only' });
  };

  return (
    <LoadingFade
      loading={loading}
      skeleton={<UserProfileViewSkeleton />}
      delayMs={250}
    >
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{ overflowX: 'hidden' }}
      >
        <ProfileHeader
          profile={profile}
          onActionFinish={handleActionFinish}
        >
          <Tabs
            key={`tabs-${id}`}
            value={currentTab}
            onChange={(_e: SyntheticEvent, v: string) => setCurrentTab(v)}
            sx={{
              width: 1,
              zIndex: 9,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              [`& .${tabsClasses.flexContainer}`]: {
                justifyContent: 'flex-start',
                px: 0,
              },
              [`& .${tabsClasses.scroller}`]: {
                display: 'flex',
                justifyContent: { xs: 'flex-start', sm: 'center' },
              },
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.MuiTabs-scrollButtons.Mui-disabled': { display: 'none' },
                '&:first-of-type': {
                  display: currentTab === 'publications' ? 'none' : 'flex',
                },
              },
            }}
          >
            {tabsWithCounts.map((tab) => (
              <Tab
                key={tab.key}
                value={tab.value}
                label={<TabLabel label={tab.label} count={tab.count} />}
              />
            ))}
          </Tabs>
        </ProfileHeader>

        {currentTab === 'publications' && (
          <ProfileHome
            publications={publications}
            scrollable={false}
            initialRows={3}
            rowsIncrement={2}
          />
        )}

        {currentTab === 'followers' && (
          <ProfileFollowers
            followers={followersList}
            loading={followersLoading}
            onActionFinished={() => loadProfile({ variables: { input: { address: id } } })}
          />
        )}

        {currentTab === 'following' && (
          <ProfileFollowing following={followingList} loading={followingLoading} />
        )}

        {currentTab === 'referrals' && session.address === id && (
          <ProfileReferrals referrals={referrals} loading={loadingReferrals} />
        )}
      </Container>
    </LoadingFade>
  );
};

export const TabLabel = ({ label, count }: TabLabelProps) => (
  <>
    {label}
    {count > 0 && (
      <Label sx={{ px: 0.75, ml: 1, fontSize: 12, color: 'text.secondary' }}>
        {count}
      </Label>
    )}
  </>
);

export default UserProfileView;
