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
import ProfileCollected from '../profile-collected';
import {useAuth} from "@src/hooks/use-auth.ts";

// ----------------------------------------------------------------------

const TABS = [
  { value: 'publications', label: 'Publications' },
  { value: 'collected', label: 'Collected' },
  { value: 'subscribers', label: 'Subscribers' },
  { value: 'subscribed', label: 'Subscribed to' },
];

// ----------------------------------------------------------------------

const UserProfileView = ({ id }: any) => {
  const [currentTab, setCurrentTab] = useState('publications');
  const settings = useSettingsContext();

  const { called, data: profile, execute } = useLazyProfile();

  const { data: publications } = usePublications({
    where: {
      from: profile?.id ? [profile.id] : [],
      publicationTypes: [PublicationType.Post],
      metadata: { publishedOn: [appId('watchit')] },
    },
  });

  useEffect(() => {
    if (!called) execute({ forProfileId: id as ProfileId })
  }, [id, execute, called]);

  const counts: any = {
    publications: publications?.length ?? 0,
    collected: profile?.stats?.collects ?? 0,
    subscribers: profile?.stats?.followers ?? 0,
    subscribed: profile?.stats?.following ?? 0,
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

  console.log('profile hello')
  console.log(profile)
  console.log(profile?.stats?.following)

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

      {currentTab === 'publications' && profile && <ProfileHome profile={profile} />}
      {currentTab === 'collected' && profile && <ProfileCollected profile={profile} />}
      {currentTab === 'subscribers' && profile && <ProfileFollowers profile={profile} onActionFinished={handleUpdateProfile} />}
      {currentTab === 'subscribed' && profile && <ProfileFollowing profile={profile} />}
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
