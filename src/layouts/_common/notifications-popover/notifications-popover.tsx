import { useCallback, useState } from 'react'
import { m } from 'framer-motion'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import NotificationItem from './notification-item'
// @ts-ignore
import emptyImage from '@src/assets/illustrations/empty-notifications.png'
import { varHover } from '@src/components/animate'
import Iconify from '@src/components/iconify'
import Image from '@src/components/image'
import Label from '@src/components/label'
import Scrollbar from '@src/components/scrollbar'
import { useBoolean } from '@src/hooks/use-boolean'
import { useNotifications } from '@src/hooks/use-notifications.ts'
import { useResponsive } from '@src/hooks/use-responsive'
import { type NotificationColumnsProps } from '@src/types/notification'

export default function NotificationsPopover() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()
  const unreadNotifications = notifications.filter((notification) => !notification.read)

  const drawer = useBoolean()
  const smUp = useResponsive('up', 'sm')

  const [currentTab, setCurrentTab] = useState('all')
  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }, [])

  const TABS = [
    {
      value: 'all',
      label: 'All',
      count: notifications.length,
    },
    {
      value: 'unread',
      label: 'Unread',
      count: unreadNotifications.length,
    },
    {
      value: 'archived',
      label: 'Archived',
      count: notifications.length - unreadNotifications.length,
    },
  ]

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {notifications.length ? (
        <Tooltip title="Mark all as read">
          <IconButton color="info" onClick={markAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  )

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'archived' && 'success') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  )

  const renderNotifications = (notifications: any) => (
    <Scrollbar>
      <List disablePadding>
        {notifications.length > 0 ? (
          notifications.map((notification: NotificationColumnsProps) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        ) : (
          <EmptyPlaceholder />
        )}
      </List>
    </Scrollbar>
  )

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

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          {/*<IconButton onClick={handleMarkAllAsRead}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton>*/}
        </Stack>

        <Divider />

        {currentTab === 'all' && renderNotifications(notifications)}

        {currentTab === 'unread' && renderNotifications(unreadNotifications)}

        {currentTab === 'archived' &&
          renderNotifications(notifications.filter((notification) => notification.read))}
      </Drawer>
    </>
  )
}

export const EmptyPlaceholder = () => {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Image
        src={emptyImage}
        sx={{
          width: 200,
        }}
      />
      <Typography
        sx={{
          textAlign: 'center',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontWeight: 'bold',
          mt: 2,
        }}
      >
        You are up to date!
        <Typography variant={'caption'}>There are no new notifications</Typography>
      </Typography>
    </Box>
  )
}
