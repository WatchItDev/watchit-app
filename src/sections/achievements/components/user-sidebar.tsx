import { FC } from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import UserSidebarGreetings from '@src/sections/achievements/components/user-sidebar-greetings.tsx';
import UserSidebarProfile from '@src/sections/achievements/components/user-sidebar-profile.tsx';
import UserSidebarRanks from '@src/sections/achievements/components/user-sidebar-ranks.tsx';
import UserSidebarLatestPerks from '@src/sections/achievements/components/user-sidebar-latest-perks.tsx';
import UserSidebarLatestActivity from '@src/sections/achievements/components/user-sidebar-lastest-activity.tsx';

export const UserSidebar: FC = () => {
  return (
    <SidebarWrapper>
      {/* Greeting */}
      <UserSidebarGreetings />

      {/* Avatar & Achievements summary */}
      <UserSidebarProfile />

      {/* Rank badges */}
      <UserSidebarRanks />

      {/*/!* Unlocked perks *!/*/}
      <UserSidebarLatestPerks />

      {/* Recent activity */}
      <UserSidebarLatestActivity />
    </SidebarWrapper>
  );
};

export default UserSidebar;

const SidebarWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  height: '100%',
}));
