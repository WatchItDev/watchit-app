import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { formatDistanceToNow } from 'date-fns';
// components
import Iconify from '@src/components/iconify';
import Box from "@mui/material/Box";

// Types / map for category number
export const NOTIFICATION_CATEGORIES: { [key: number]: string } = {
  1: 'Follow',
  2: 'Like',
  3: 'Comment',
  4: 'Join',
  5: 'Mention',
};

// Inverted type for notification columns to use text as key and id as value
export const NOTIFICATION_CATEGORIES_LABELS: { [key: string]: number } = {
  'FOLLOW': 1,
  'Like': 2,
  'COMMENT': 3,
  'JOIN': 4,
  'MENTION': 5,
};

export type NotificationColumnsProps = {
  id: string;
  payload: any; // Store all data for notification: type, category, data, description, etc. (can be added as needed)
  read: boolean;
  sender_id: string;
  receiver_id: string;
  created_at: string | Date;
}

type NotificationItemProps = {
  notification: NotificationColumnsProps;
  onMarkAsRead: (id: string) => void;
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const handleItemClick = () => {
    onMarkAsRead(notification.id);
  };

  const renderAvatar = (
    <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <Iconify icon="eva:person-fill" />
        </Avatar>
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={
        <Typography variant="subtitle2" noWrap>
          {notification?.payload?.data?.description}
        </Typography>
      }
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{typography: 'caption', color: 'text.disabled'}}
          spacing={1}
        >
          <span>{formatDistanceToNow(new Date(notification.created_at), {addSuffix: true})}</span>
          <span>{NOTIFICATION_CATEGORIES[notification?.payload?.category]}</span>
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.read && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  return (
    <ListItemButton
      disableRipple
      onClick={handleItemClick}
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>{renderText}</Stack>
    </ListItemButton>
  );
}
