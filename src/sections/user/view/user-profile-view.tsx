import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// hooks
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileFollowers from '../profile-followers';
import { useAuth } from '../../../hooks/use-auth';

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
    value: 'friends',
    label: 'Friends',
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
  {
    value: 'gallery',
    label: 'Gallery',
    icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  // const { user } = useMockedUser();

  const { selectedProfile } = useAuth();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFriends(event.target.value);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          my: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={_userAbout.role}
          name={selectedProfile?.handle?.localName ?? ''}
          avatarUrl={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${selectedProfile?.id}`}
          coverUrl={_userAbout.coverUrl}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && <ProfileHome info={_userAbout} posts={_userFeeds} />}

      {currentTab === 'followers' && <ProfileFollowers followers={_userFollowers} />}

      {currentTab === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}

      {currentTab === 'gallery' && <ProfileGallery gallery={_userGallery} />}
    </Container>
  );
}
