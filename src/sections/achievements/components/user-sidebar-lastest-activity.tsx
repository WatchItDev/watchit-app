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
import CheckGreen from '@src/assets/illustrations/check_green.png';

import { useAuth } from '@src/hooks/use-auth';
import { useGetUserEventsQuery } from '@src/graphql/generated/hooks.tsx';
import { EventLog } from '@src/graphql/generated/graphql.ts';

export const UserSidebarLatestActivity: FC = () => {
  const { session } = useAuth();
  const address = session?.user?.address ?? '';
  const { data: eventsData } = useGetUserEventsQuery({ variables: { address, limit: 6 } });

  const recentActivity: string[] = eventsData?.getUserEvents.map((e: EventLog) => e.type.replace(/_/g, ' ').toLowerCase()) ?? [];

  return (
    <Card sx={{ px: 0, mt: -2 }}>
      <CardHeader title="Latest Activity" sx={{ px: 0 }} />
      <CardContent sx={{ px: 0, pt: 1 }}>
        <List dense disablePadding>
          {recentActivity.length === 0 && (
            <Typography variant="body2" sx={{ pl: 2, py: 1 }}>
              No recent actions
            </Typography>
          )}
          {recentActivity.map((desc, idx) => (
            <ListItem key={idx} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <SmallIcon src={CheckGreen} alt="•" sx={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText
                primary={desc}
                primaryTypographyProps={{ variant: 'body2', textTransform: 'capitalize' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserSidebarLatestActivity;

const SmallIcon = styled('img')({ width: 18, height: 18, objectFit: 'contain' });
