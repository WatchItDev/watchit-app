import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { formatDistanceToNow } from 'date-fns';
// components
import Box from "@mui/material/Box";
import TextMaxLine from "@src/components/text-max-line";
import {useRouter} from "@src/routes/hooks";
import {paths} from "@src/routes/paths.ts";

// Categories for notifications

export const NOTIFICATION_CATEGORIES: { [key: string]: number } = {
  'FOLLOW': 1,
  'LIKE': 2,
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
  const router = useRouter();
  const handleItemClick = () => {
    onMarkAsRead(notification.id);

    // Verify if is LIKE / COMMENT
    if(notification?.payload?.category === NOTIFICATION_CATEGORIES['LIKE']  || notification?.payload?.category === NOTIFICATION_CATEGORIES['COMMENT']){
      router.push(paths.dashboard.publication.details(notification?.payload?.data?.content?.post_id));
    }

    // Verify if is FOLLOW / JOIN
    if(notification?.payload?.category === NOTIFICATION_CATEGORIES['FOLLOW'] || notification?.payload?.category === NOTIFICATION_CATEGORIES['JOIN']){
      router.push(paths.dashboard.user.root(`${notification?.payload?.data?.from?.id}`))
    }
  };

  const renderAvatar = (
    <ListItemAvatar>
        <Avatar src={notification?.payload?.data?.from?.avatar}  sx={{ bgcolor: 'background.neutral' }} />
    </ListItemAvatar>
  );
  const description: string | null = notification?.payload?.data?.content?.rawDescription;
  const renderText = (
    <ListItemText
      disableTypography
      primary={
        <TextMaxLine line={2} variant="subtitle2">{description}</TextMaxLine>
      }
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{typography: 'caption', color: 'text.disabled'}}
          spacing={1}
        >
          <span>{formatDistanceToNow(new Date(notification.created_at), {addSuffix: true})}</span>
          {/*<span>{NOTIFICATION_CATEGORIES[notification?.payload?.category]}</span>*/}
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
