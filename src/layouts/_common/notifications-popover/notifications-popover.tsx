import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
// @mui
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from '@src/hooks/use-boolean';
import { useResponsive } from '@src/hooks/use-responsive';
// components
import Iconify from '@src/components/iconify';
import Scrollbar from '@src/components/scrollbar';
import { varHover } from '@src/components/animate';
import { useNotifications, NotificationType, appId } from '@lens-protocol/react-web';
import NotificationItem from './notification-item';

export default function NotificationsPopover() {
  const drawer = useBoolean();
  const smUp = useResponsive('up', 'sm');
  const [notifications, setNotifications] = useState([]);

  const { data } = useNotifications({
    where: {
      publishedOn: [appId('watchit')],
      notificationTypes: [
        NotificationType.Followed,
        NotificationType.Commented,
        NotificationType.Acted,
        NotificationType.Mentioned,
        NotificationType.Reacted,
      ],
    },
  });

  const getReadNotifications = () => {
    const readNotifications = localStorage.getItem('readNotifications');
    return readNotifications ? JSON.parse(readNotifications) : [];
  };

  const setReadNotifications = (readNotifications: any) => {
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  };

  useEffect(() => {
    if (data) {
      const readNotifications = getReadNotifications();

      const mappedNotifications = data.map((notification) => {
        let mappedNotification = {
          id: notification.id,
          title: '',
          category: notification.__typename,
          createdAt: new Date(),
          isUnRead: true,
          type: notification.__typename,
          avatarUrl: null,
        };

        const isRead = readNotifications.includes(notification.id);
        mappedNotification.isUnRead = !isRead;

        switch (notification.__typename) {
          case 'ActedNotification':
            if (notification.actions && notification.actions.length > 0) {
              const action = notification.actions[0];
              mappedNotification.title = `${action.by.handle.suggestedFormatted.localName} realizó una acción`;
              mappedNotification.createdAt = action.actedAt;
              mappedNotification.avatarUrl = action.by.metadata.picture?.optimized?.uri || null;
            }
            break;

          case 'CommentNotification':
            mappedNotification.title = `${notification.comment.by.handle.suggestedFormatted.localName} comentó: "${notification.comment.metadata.content}"`;
            mappedNotification.createdAt = notification.comment.createdAt;
            mappedNotification.avatarUrl =
              notification.comment.by.metadata.picture?.optimized?.uri || null;
            break;

          default:
            mappedNotification.title = 'Nueva notificación';
            break;
        }

        return mappedNotification;
      });

      setNotifications(mappedNotifications);
    }
  }, [data]);

  const totalUnRead = notifications.filter((item) => item.isUnRead).length;

  const handleMarkAllAsRead = () => {
    const allNotificationIds = notifications.map((notification) => notification.id);
    setReadNotifications(allNotificationIds);

    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnRead: false,
    }));

    setNotifications(updatedNotifications);
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Marcar todas como leídas">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar>
          <List disablePadding>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={(id) => {
                  const readNotifications = getReadNotifications();
                  if (!readNotifications.includes(id)) {
                    readNotifications.push(id);
                    setReadNotifications(readNotifications);
                  }

                  setNotifications((prevNotifications) =>
                    prevNotifications.map((notif) =>
                      notif.id === id ? { ...notif, isUnRead: false } : notif
                    )
                  );
                }}
              />
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </>
  );
}
