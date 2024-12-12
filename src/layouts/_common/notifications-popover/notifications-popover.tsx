import { m } from 'framer-motion';
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
import NotificationItem from './notification-item';
import {type NotificationColumnsProps} from '@src/types/notification';
import { useNotifications } from "@src/hooks/use-notifications.ts";

export default function NotificationsPopover() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const drawer = useBoolean();
  const smUp = useResponsive('up', 'sm');

  const unreadNotifications = notifications.filter((notification) => !notification.read);

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {notifications.length  ? (
        <Tooltip title="Marcar todas como leídas">
          <IconButton color="info" onClick={markAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      ) : <></>}

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
        <Badge badgeContent={unreadNotifications.length} color="error">
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
            { !!notifications ? (
              notifications.map((notification: NotificationColumnsProps) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))
            ) : <></>}
          </List>
        </Scrollbar>
      </Drawer>
    </>
  );
}
