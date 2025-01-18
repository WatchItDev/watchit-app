import { useEffect, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

// components
import { useSettingsContext } from '@src/components/settings';
import { useLazyProfile, useProfileFollowers, useProfileFollowing } from '@lens-protocol/react';
import { appId, ProfileId, PublicationType, usePublications } from '@lens-protocol/react-web';
import ProfileHome from '../profile-home';
import ProfileFollowers from '../profile-followers';
import ProfileFollowing from '../profile-following';
import ProfileHeader from '../profile-header';
import Label from '../../../components/label';
import { LoadingScreen } from '@src/components/loading-screen';

// redux
import { useSelector, useDispatch } from 'react-redux';
// @ts-ignore
import { RootState } from '@src/redux/store';
import { setFollowers, setFollowings } from '@redux/followers';
import ProfileReferrals from "@src/sections/user/profile-referrals.tsx";
import useReferrals from "@src/hooks/use-referrals.ts";

// ----------------------------------------------------------------------

const TABS = [
  { value: 'publications', label: 'Publications' },
  { value: 'followers', label: 'Followers' },
  { value: 'following', label: 'Following' },
  { value: 'referrals', label: 'Referrals' },
];

// ----------------------------------------------------------------------

const UserProfileView = ({ id }: any) => {
  const dispatch = useDispatch();
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('publications');
  const { called, data: profile, loading: loadingProfile, execute } = useLazyProfile();
  const { data: publications, loading: loadingPublications } = usePublications({
    where: {
      from: profile?.id ? [profile.id] : [],
      publicationTypes: [PublicationType.Post],
      metadata: { publishedOn: [appId('watchit')] },
    },
  });

  const { invitations: referrals, fetchInvitations, loading: loadingReferrals } = useReferrals();

  const { data: followers } = useProfileFollowers({
    // @ts-ignore
    of: profile?.id,
  });

  const { data: following } = useProfileFollowing({
    // @ts-ignore
    for: profile?.id,
  });

  useEffect(() => {
    (async () => {
      if (id !== profile?.id || !called) await execute({ forProfileId: id as ProfileId });
    })();
  }, [profile?.id, id]);

  useEffect(() => {
    if (profile) {
      dispatch(setFollowers(followers ?? []));
    }
  }, [profile, followers, dispatch]);

  useEffect(() => {
    if (profile) {
      dispatch(setFollowings(following ?? []));
    }
  }, [profile, following, dispatch]);

  // Call the fetchInvitations function
  useEffect(() => {
    if (profile) {
      fetchInvitations(profile.id);
    }
  }, [profile]);

  const followersStore = useSelector((state: RootState) => state.followers.followers);
  const followingsStore = useSelector((state: RootState) => state.followers.followings);

  const counts: any = {
    publications: publications?.length ?? 0,
    followers: followersStore.length ?? 0,
    following: followingsStore.length ?? 0,
    referrals: referrals?.length ?? 0,
  };

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  const handleUpdateProfile = () => {
    execute({ forProfileId: id as ProfileId });
  };

  const tabsWithCounts = TABS.map((tab: any) => ({
    ...tab,
    key: tab.value,
    count: counts[tab.value],
  }));

  if (loadingProfile || loadingPublications) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ overflowX: 'hidden' }}>
      <ProfileHeader profile={profile as any}>
        <Tabs
          key={`tabs-${profile?.id}`}
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            zIndex: 9,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            [`& .${tabsClasses.flexContainer}`]: { justifyContent: 'center' },
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
      {currentTab === 'referrals' && profile && <ProfileReferrals referrals={referrals} loading={loadingReferrals}  />}
    </Container>
  );
};

const TabLabel = ({ label, count }: any) => (
  <>
    {label}
    {count > 0 && (
      <Label sx={{ px: 0.75, ml: 1, fontSize: 12, color: 'text.secondary' }}>{count}</Label>
    )}
  </>
);

export default UserProfileView;
