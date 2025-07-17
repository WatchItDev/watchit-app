import { FC } from 'react';

import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';

import CheckDark from '@src/assets/illustrations/check_dark.png';
import CheckGreen from '@src/assets/illustrations/check_green.png';
import { useAuth } from '@src/hooks/use-auth';
import { useGetUnlockedPerksQuery } from '@src/graphql/generated/hooks.tsx';
import { UnlockedPerkState } from '@src/graphql/generated/graphql.ts';
import { useStaleWhileLoading } from '@src/hooks/use-stale-while-loading.ts';

export const UserSidebarLatestPerks: FC = () => {
  const { session } = useAuth();
  const address = session?.user?.address ?? '';
  const raw = useGetUnlockedPerksQuery({
    variables: { address },
    fetchPolicy: 'network-only',
  });
  const { data: perksData } = useStaleWhileLoading(raw);

  const unlockedPerks: UnlockedPerkState[] = (perksData?.getUnlockedPerks.filter((p: UnlockedPerkState) => p.status === 'CLAIMED') ?? []).slice(0, 6);

  return (
    <Card sx={{ px: 0, mb: 0 }}>
      <CardHeader title="Latest Unlocked Perks" sx={{ px: 0 }} />
      <CardContent sx={{ px: 0, pt: 1 }}>
        <List dense disablePadding>
          {unlockedPerks.length === 0 && (
            <Typography variant="body2" sx={{ pl: 2, py: 1 }}>
              No perks yet
            </Typography>
          )}
          {unlockedPerks.map((perkState) => (
            <ListItem key={perkState.id} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <SmallIcon
                  src={perkState.status === 'CLAIMED' ? CheckGreen : CheckDark}
                  alt=""
                  sx={{ width: 24, height: 24 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={perkState.perk.name}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserSidebarLatestPerks;

const SmallIcon = styled('img')({ width: 18, height: 18, objectFit: 'contain' });
