import { FC } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';

import AvatarProfile from '@src/components/avatar/avatar';
import CheckDark from '@src/assets/illustrations/check_dark.png';
import CheckGreen from '@src/assets/illustrations/check_green.png';
import WaveImg from '@src/assets/illustrations/hi.png';
import Watcher from '@src/assets/illustrations/watcher.png';
import Fan from '@src/assets/illustrations/fan.png';
import Engager from '@src/assets/illustrations/engager.png';
import Supporter from '@src/assets/illustrations/supporter.png';
import Spotlighter from '@src/assets/illustrations/splotligther.png';
import Scout from '@src/assets/illustrations/scout.png';
import Storykeeper from '@src/assets/illustrations/storykeeper.png';
import Guardian from '@src/assets/illustrations/guardian.png';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { useAuth } from '@src/hooks/use-auth.ts';

// -----------------------------------------------------------------------------
//  MOCK DATA (replace with API when ready)
// -----------------------------------------------------------------------------
const user = {
  name: 'Luisa',
  tagline: `Let's earn something today`,
  avatar:
    'https://avatars.dicebear.com/api/adventurer-neutral/luisa.svg', // placeholder – replace with real
  currentRank: 3,
  unlockedPerks: [
    'Access to public content',
    'Publicly visible rank',
    'Access to daily quests',
    'Profile frame unlock',
    'Early access to premieres',
  ],
  activity: [
    'Refer a friend (+5 XP)',
    'First flame NFT claimed',
    'Watched a full video (+10 XP)',
    'Unlocked premium content',
    'Register (+50 XP)',
  ],
};

const ranks = [
  { id: 1, name: 'Watcher', icon: Watcher },
  { id: 2, name: 'Fan', icon: Fan },
  { id: 3, name: 'Engager', icon: Engager },
  { id: 4, name: 'Supporter', icon: Supporter },
  { id: 5, name: 'Spotlighter', icon: Spotlighter },
  { id: 6, name: 'Scout', icon: Scout },
  { id: 7, name: 'Storykeeper', icon: Storykeeper },
  { id: 8, name: 'Guardian', icon: Guardian },
];

const SidebarWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  height: '100%',
}));

const SmallIcon = styled('img')({
  width: 18,
  height: 18,
  objectFit: 'contain',
});

const MediumIcon = styled('img')({
  width: 36,
  height: 36,
  objectFit: 'contain',
});

const RankIcon = styled(AvatarProfile)({
  width: 36,
  height: 36,
});

export const UserSidebar: FC = () => {
  const { session } = useAuth();

  return (
    <SidebarWrapper>
      {/* Greeting */}
      <Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h3" fontWeight={700} lineHeight={1.2}>
            Hi {session?.user?.displayName?.split(' ')[0]}!
          </Typography>
          <MediumIcon src={WaveImg} alt="👋" />
        </Box>
        <Typography variant="h5" fontWeight={'lighter'} color="text.secondary" mb={2}>
          {user.tagline}
        </Typography>
      </Box>

      {/* Avatar */}
      <Box display="flex" justifyContent="center" mb={2}>
        <AvatarProfile
          src={(session?.user?.profilePicture || session?.user?.address) ?? ''}
          alt={session?.user?.displayName || session?.user?.address}
          sx={{ width: 128, height: 128 }}
        />
      </Box>

      {/* Rank badges */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gap={2}
        justifyItems="center"
        mb={3}
      >
        {ranks.map(({ id, icon }) => (
          <RankIcon
            key={id}
            src={icon}
            alt=""
            sx={{
              width: 45,
              height: 45,
              opacity: id <= user.currentRank ? 1 : 0.35,
              filter: id <= user.currentRank ? 'none' : 'grayscale(1)',
            }}
          />
        ))}
      </Box>

      <Card sx={{ px: 0 }}>
        <CardHeader title={'Unlocked Perks'} sx={{ px: 0 }} />
        <CardContent sx={{ px: 0, pt: 1 }}>
          <List dense disablePadding>
            {user.unlockedPerks.map((perk) => (
              <ListItem key={perk} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <SmallIcon src={CheckGreen} alt="✓" sx={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary={perk}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ px: 0 }}>
        <CardHeader title={'Activity'} sx={{ px: 0 }} />
        <CardContent sx={{ px: 0, pt: 1 }}>
          <List dense disablePadding>
            {user.activity.map((a) => (
              <ListItem key={a} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <SmallIcon src={CheckDark} alt="•" sx={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary={a}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </SidebarWrapper>
  );
}

export default UserSidebar;
