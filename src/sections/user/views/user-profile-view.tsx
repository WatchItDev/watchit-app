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
import { LoadingScreen } from '@src/components/loading-screen';
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
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('publications');
  const { session, isAuthLoading } = useAuth();
  const { isAuthorized, loading: authorizedLoading } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    session?.address as Address
  );
  const [loadProfile,  { data: profileData,           loading: loadingProfile          }] = useGetUserLazyQuery();
  const [loadPosts,    { data: postsData,             loading: loadingPosts            }] = useGetPostsByAuthorLazyQuery();
  const [loadFollowers,{ data: followersData,         loading: loadingFollowers        }] = useGetUserFollowersLazyQuery();
  const [loadFollowing,{ data: followingData,         loading: loadingFollowing        }] = useGetUserFollowingLazyQuery();
  const { invitations: referrals, fetchInvitations, loading: loadingReferrals } = useReferrals();

  const counts: CountsData = useMemo(() => ({
    publications : postsData?.getPostsByAuthor?.length        ?? 0,
    followers    : followersData?.getUserFollowers?.length    ?? profileData?.getUser?.followersCount ?? 0,
    following    : followingData?.getUserFollowing?.length    ?? profileData?.getUser?.followingCount ?? 0,
    referrals    : referrals?.length                          ?? 0,
  }), [postsData, followersData, followingData, profileData, referrals]);

  useEffect(() => {
    loadProfile({variables: { input: { address: id } }});
    loadPosts({variables: { author: id, limit: 50 }});
    fetchInvitations(id);
  }, [id]);

  useEffect(() => {
    if (currentTab === 'followers')  loadFollowers({ variables: { address: id, limit: 50 } });
    if (currentTab === 'following')  loadFollowing({ variables: { address: id, limit: 50 } });
  }, [currentTab, id]);

  if (loadingProfile || loadingPosts || !profileData?.getUser) return <LoadingScreen />;

  const showSubscriptionAlert =
    session?.authenticated &&
    session?.address === id &&
    counts.publications >= 1 &&
    !isAuthLoading &&
    !isAuthorized &&
    !authorizedLoading;

  const tabsWithCounts: TabItemWithCount[] = TABS
    .filter(tab => !(tab.value === 'referrals' && session.address !== id))
    .map(tab => ({ ...tab, key: tab.value, count: counts[tab.value as keyof CountsData] ?? 0 }));

  const handleActionFinish = () => {
    loadFollowers({ variables: { address: id, limit: 50 } })
    loadFollowing({ variables: { address: id, limit: 50 } })
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ overflowX: 'hidden' }}>
      {showSubscriptionAlert && (
        <Alert severity="warning" sx={{ mt: 2, mb: -1 }}>
          Set your subscription prices so users can access your content. Click 'Set Joining Prices' next to your profile picture.
        </Alert>
      )}
      <ProfileHeader profile={profileData?.getUser} onActionFinish={handleActionFinish}>
        <Tabs
          key={`tabs-${id}`}
          value={currentTab}
          onChange={(_e: SyntheticEvent, v: string) => setCurrentTab(v)}
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
          {tabsWithCounts.map(tab => (
            <Tab key={tab.key} value={tab.value} label={<TabLabel label={tab.label!} count={tab.count} />} />
          ))}
        </Tabs>
      </ProfileHeader>

      {currentTab === 'publications' && (
        <ProfileHome
          publications={postsData?.getPostsByAuthor}
          scrollable={false}
          initialRows={3}
          rowsIncrement={2}
        />
      )}

      {currentTab === 'followers' && (
        <ProfileFollowers
          followers={followersData?.getUserFollowers ?? []}
          loading={loadingFollowers}
          onActionFinished={() => loadProfile({ variables: { input: { address: id } } })}
        />
      )}

      {currentTab === 'following' && (
        <ProfileFollowing
          following={followingData?.getUserFollowing ?? []}
          loading={loadingFollowing}
        />
      )}

      {currentTab === 'referrals' && session.address === id && (
        <ProfileReferrals referrals={referrals} loading={loadingReferrals} />
      )}
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
