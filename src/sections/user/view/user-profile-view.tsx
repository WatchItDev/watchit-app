import { useEffect, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

// components
import { useSettingsContext } from '@src/components/settings';
import { useLazyProfile } from '@lens-protocol/react';
import { appId, ProfileId, PublicationType, usePublications } from '@lens-protocol/react-web';
import ProfileHome from '../profile-home';
import ProfileFollowers from '../profile-followers';
import ProfileFollowing from '../profile-following';
import ProfileHeader from '../profile-header';
import Label from '../../../components/label';
import { LoadingScreen } from '@src/components/loading-screen';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'publications', label: 'Publications' },
  { value: 'followers', label: 'Followers' },
  { value: 'following', label: 'Following' },
];

// ----------------------------------------------------------------------

const UserProfileView = ({ id }: any) => {
  const [currentTab, setCurrentTab] = useState('publications');
  const settings = useSettingsContext();
  const { called, data: profile, loading: loadingProfile, execute } = useLazyProfile();
  const { data: publications, loading: loadingPublications } = usePublications({
    where: {
      from: profile?.id ? [profile.id] : [],
      publicationTypes: [PublicationType.Post],
      metadata: { publishedOn: [appId('watchit')] },
    },
  });

  useEffect(() => {
    if (id !== profile?.id) execute({ forProfileId: id as ProfileId })
  }, [id, execute, called, profile?.id]);

  const counts: any = {
    publications: publications?.length ?? 0,
    followers: profile?.stats?.followers ?? 0,
    following: profile?.stats?.following ?? 0,
  };

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  const handleUpdateProfile = () => {
    execute({ forProfileId: id as ProfileId })
  };

  const tabsWithCounts = TABS.map((tab: any) => ({
    ...tab,
    key: tab.value,
    count: counts[tab.value],
  }));

  if (loadingProfile || loadingPublications) return <LoadingScreen />

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ProfileHeader profile={profile as any}>
        <Tabs
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

      {currentTab === 'publications' && profile && <ProfileHome publications={publications} />}
      {currentTab === 'followers' && profile && <ProfileFollowers profile={profile} onActionFinished={handleUpdateProfile} />}
      {currentTab === 'following' && profile && <ProfileFollowing profile={profile} />}
    </Container>
  );
};

const TabLabel = ({ label, count }: any) => (
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
