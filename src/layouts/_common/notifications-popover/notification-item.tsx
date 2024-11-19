import Box from '@mui/material/Box';
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

type NotificationItemProps = {
  notification: {
    id: string;
    title: string;
    category: string;
    createdAt: string | Date;
    isUnRead: boolean;
    type: string;
    avatarUrl: string | null;
  };
  onMarkAsRead: (id: string) => void;
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const handleItemClick = () => {
    onMarkAsRead(notification.id);
    // Aquí puedes agregar la lógica adicional que quieras al hacer clic en la notificación
  };

  const renderAvatar = (
    <ListItemAvatar>
      {notification.avatarUrl ? (
        <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <Iconify icon="eva:person-fill" />
        </Avatar>
      )}
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={
        <Typography variant="subtitle2" noWrap>
          {notification.title}
        </Typography>
      }
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          spacing={1}
        >
          <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
          <span>{notification.category}</span>
        </Stack>
      }
    />
  );

  const renderUnReadBadge = notification.isUnRead && (
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
