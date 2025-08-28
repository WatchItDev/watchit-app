// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import TextMaxLine from '@src/components/text-max-line';

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import AvatarProfile from '@src/components/avatar/avatar.tsx';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import {
  NotificationCategories,
  NotificationItemProps,
} from '@src/hooks/types';
import { useNotifications } from '@src/hooks/use-notifications.ts';

export default function NotificationItem({
  notification: n,
  onMarkAsRead,
}: NotificationItemProps) {
  const notification = n.notification ? n.notification : n;
  const router = useRouter();
  const { deleteNotification } = useNotifications();
  const typeOfNotification = notification?.payload?.category;
  const receiver = notification?.payload?.data?.to?.displayName;
  const message =
    notification?.payload?.data?.content?.message ||
    notification?.payload?.data?.content?.comment ||
    '';

  const handleItemClick = () => {
    onMarkAsRead(notification?.id);

    // Verify if is LIKE / COMMENT
    if (
      typeOfNotification === NotificationCategories.LIKE ||
      typeOfNotification === NotificationCategories.COMMENT
    ) {
      router.push(
        paths.dashboard.publication.details(
          notification.payload.data.content.root_id,
        ),
      );
    }

    // Verify if is FOLLOW / JOIN
    if (
      typeOfNotification === NotificationCategories.FOLLOW ||
      typeOfNotification === NotificationCategories.JOIN
    ) {
      router.push(
        paths.dashboard.user.root(`${notification?.payload?.data?.from?.id}`),
      );
    }
  };

  if (!notification.payload) return <></>;

  const renderAvatar = (
    <ListItemAvatar>
      <AvatarProfile
        src={notification?.payload?.data?.from?.avatar}
        sx={{ bgcolor: 'background.neutral' }}
      />
    </ListItemAvatar>
  );
  const description: string | null =
    notification?.payload?.data?.content?.rawDescription;
  const renderText = (
    <ListItemText
      disableTypography
      primary={
        <TextMaxLine line={2} variant="subtitle2">
          {description}
        </TextMaxLine>
      }
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          spacing={1}
        >
          <span>
            {notification?.created_at
              ? formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                })
              : ''}
          </span>
        </Stack>
      }
    />
  );

  function reader(data: string) {
    return data.length > 8 ? (
      <Box
        dangerouslySetInnerHTML={{ __html: data }}
        sx={{
          mb: 0.5,
          '& p': { typography: 'body2', m: 0 },
          '& a': { color: 'inherit', textDecoration: 'none' },
          '& strong': { typography: 'subtitle2' },
        }}
      />
    ) : null;
  }

  const transferAction = (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      >
        {reader(`<p><strong>@${receiver}</strong> ${message}.</p>`)}
      </Box>
    </Stack>
  );

  const messageAction = message.length > 0 && (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      >
        {reader(`<p>${message}.</p>`)}
      </Box>
    </Stack>
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

  const onDelete = async (id: string) => {
    await deleteNotification(id);
  };

  const renderDeleteButton = () => {
    return (
      notification.read && (
        <IconButton
          size="small"
          onClick={() => onDelete(notification.id)}
          sx={{
            position: 'absolute',
            right: 20,
            top: 30,
            width: 32,
            height: 32,
            transform: 'translateY(-50%)',
            borderRadius: '50%',
            bgcolor: 'background.neutral',
          }}
        >
          <Iconify icon="solar:trash-bin-minimalistic-2-bold" width={16} />
        </IconButton>
      )
    );
  };

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

      {renderDeleteButton()}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {typeOfNotification === NotificationCategories.TRANSFER &&
          transferAction}
        {typeOfNotification === NotificationCategories.COMMENT && messageAction}
      </Stack>
    </ListItemButton>
  );
}
