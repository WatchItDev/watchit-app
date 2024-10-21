import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
// eslint-disable-next-line import/no-extraneous-dependencies
import { useProfile } from '@lens-protocol/react';
import { ProfileId } from '@lens-protocol/react-web';
import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFollowers from '../profile-followers';
import ProfileFollowing from '../profile-following';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'followers',
    label: 'Followers',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  },
  {
    value: 'following',
    label: 'Following',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  }
];

// ----------------------------------------------------------------------

const UserProfileView = ({ id }: { id: string | undefined }) => {
  const [currentTab, setCurrentTab] = useState('profile');
  const settings = useSettingsContext();
  const { data: profile, error, loading } = useProfile({
    forProfileId: id as ProfileId
  });

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  console.log('profile')
  console.log(profile)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          my: 3,
          height: 400,
        }}
      >
        <ProfileCover
          profile={profile}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: '#2b2d31',
            [`& .${tabsClasses.flexContainer}`]: {
              justifyContent: 'center'
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && profile && <ProfileHome profile={profile} />}

      {currentTab === 'followers' && profile && <ProfileFollowers profile={profile} />}

      {currentTab === 'following' && profile && <ProfileFollowing profile={profile} />}
    </Container>
  );
}

export default UserProfileView
