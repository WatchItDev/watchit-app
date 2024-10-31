import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

// components
import { useSettingsContext } from 'src/components/settings';
import { useProfile, useLazyProfile } from '@lens-protocol/react';
import { appId, ProfileId, PublicationType, usePublications } from '@lens-protocol/react-web';
import ProfileHome from '../profile-home';
import ProfileFollowers from '../profile-followers';
import ProfileFollowing from '../profile-following';
import ProfileHeader from '../profile-header';
import Label from '../../../components/label';
import ProfileCollected from '../profile-collected';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'publications', label: 'Publications' },
  { value: 'collected', label: 'Collected' },
  { value: 'followers', label: 'Followers' },
  { value: 'following', label: 'Following' }
];

// ----------------------------------------------------------------------

const UserProfileView = ({ id }: { id: string | undefined }) => {
  const [currentTab, setCurrentTab] = useState('publications');
  const settings = useSettingsContext();

  const { data: profile, loading } = useProfile({ forProfileId: id as ProfileId });

  const { data: publications, loading: publicationsLoading } = usePublications({
    where: {
      from: [...(profile?.id ? [profile.id] : [])],
      publicationTypes: [PublicationType.Post],
      metadata: { publishedOn: [appId('watchit')] }
    }
  });

  console.log('hello profile stats')
  console.log(profile?.stats?.collects)
  console.log(profile?.stats?.followers)
  console.log(profile?.stats?.following)
  console.log(loading)

  const counts: any = {
    publications: publications?.length ?? 0,
    collected: profile?.stats.collects ?? 0,
    followers: profile?.stats.followers ?? 0,
    following: profile?.stats.following ?? 0,
  };

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

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
            [`& .${tabsClasses.flexContainer}`]: { justifyContent: 'center' }
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={`${tab.value}-${counts[tab.value]}`}
              value={tab.value}
              label={<TabLabel label={tab.label} count={counts[tab.value]} />}
            />
          ))}
        </Tabs>
      </ProfileHeader>

      {currentTab === 'publications' && profile && <ProfileHome profile={profile} />}
      {currentTab === 'collected' && profile && <ProfileCollected profile={profile} />}
      {currentTab === 'followers' && profile && <ProfileFollowers profile={profile} />}
      {currentTab === 'following' && profile && <ProfileFollowing profile={profile} />}
    </Container>
  );
};

const TabLabel = ({ label, count }: { label: string, count: number }) => (
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
