import { useEffect, useState } from 'react'
import { usePublication } from '@lens-protocol/react'
import { PublicationReactionType, useReactionToggle } from '@lens-protocol/react-web'
import { openLoginModal } from '@redux/auth'
import { decrementCounterLikes, incrementCounterLikes } from '@redux/comments'
import { formatDistanceToNow } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import AvatarProfile from "@src/components/avatar/avatar.tsx"
import Iconify from '@src/components/iconify'
import TextMaxLine from '@src/components/text-max-line'
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts'
import { useNotifications } from '@src/hooks/use-notifications.ts'
import { useRouter } from '@src/routes/hooks'
import { paths } from '@src/routes/paths.ts'
import { NotificationCategories, type NotificationColumnsProps } from '@src/types/notification.ts'

export type NotificationItemProps = {
  id: any;
  notification: NotificationColumnsProps;
  onMarkAsRead: (id: string) => void;
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const commentId = notification?.payload?.data?.content?.comment_id

  const sessionData = useSelector((state: any) => state.auth.session)
  const { deleteNotification } = useNotifications()
  const dispatch = useDispatch()
  const { execute: toggle, loading: loadingLike } = useReactionToggle()
  const typeOfNotification = notification?.payload?.category
  const receiver = notification?.payload?.data?.to?.displayName
  const message =
    notification?.payload?.data?.content?.message ||
    notification?.payload?.data?.content?.comment ||
    ''
  const [hasLiked, setHasLiked] = useState(false)
  const { sendNotification } = useNotifications()
  const { generatePayload } = useNotificationPayload(sessionData)
  const router = useRouter()
  const { data: comment, loading }: any = usePublication({ forId: commentId as any })

  useEffect(() => {
    setHasLiked(comment?.operations?.hasUpvoted)
  }, [comment])

  const handleItemClick = () => {
    onMarkAsRead(notification.id)

    // Verify if is LIKE / COMMENT
    if (
      typeOfNotification === NotificationCategories.LIKE ||
      typeOfNotification === NotificationCategories.COMMENT
    ) {
      router.push(paths.dashboard.publication.details(notification.payload.data.content.root_id))
    }

    // Verify if is FOLLOW / JOIN
    if (
      typeOfNotification === NotificationCategories.FOLLOW ||
      typeOfNotification === NotificationCategories.JOIN
    ) {
      router.push(paths.dashboard.user.root(`${notification.payload.data.from.id}`))
    }
  }

  const toggleReaction = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal())

    try {
      await toggle({
        reaction: PublicationReactionType.Upvote,
        publication: comment,
      }).then(() => {
        // Send notification to the author of the comment
        const notificationPayload = generatePayload(
          'LIKE',
          {
            id: comment?.by?.id,
            displayName: comment?.by?.metadata?.displayName ?? 'no name',
            avatar: comment?.by?.metadata?.avatar,
          },
          {
            root_id: comment?.commentOn?.root?.id ?? comment?.commentOn?.id,
            parent_id: comment?.commentOn?.id,
            comment_id: comment?.id,
            rawDescription: `${sessionData?.profile?.metadata?.displayName} liked your comment`,
          }
        )

        if (!hasLiked) {
          dispatch(incrementCounterLikes(comment.id))
        } else {
          dispatch(decrementCounterLikes(comment.id))
        }

        if (!hasLiked && comment?.by?.id !== sessionData?.profile?.id) {
          sendNotification(comment?.by?.id, sessionData?.profile?.id, notificationPayload)
        }
      })
      setHasLiked(!hasLiked) // Toggle the UI based on the reaction state
    } catch (err) {
      console.error('Error toggling reaction:', err)
    }
  }

  const renderAvatar = (
    <ListItemAvatar>
      <AvatarProfile src={notification.payload.data.from.avatar} sx={{ bgcolor: 'background.neutral' }} />
    </ListItemAvatar>
  )
  const description: string | null = notification.payload.data.content.rawDescription
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
          <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
        </Stack>
      }
    />
  )

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
    ) : null
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
  )

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

      {/*Stack for show IconHeart and Reply icon*/}
      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={toggleReaction}
          size="small"
          sx={{ p: 1, bgcolor: 'background.neutral' }}
        >
          {loading || loadingLike ? (
            <CircularProgress size="25px" sx={{ color: '#fff' }} />
          ) : hasLiked ? (
            <Iconify icon="eva:heart-fill" width={16} />
          ) : (
            <Iconify icon="mdi:heart-outline" width={16} />
          )}
        </IconButton>
        <IconButton size="small" sx={{ p: 1, bgcolor: 'background.neutral' }}>
          <Iconify icon="material-symbols:reply" width={16} />
        </IconButton>
      </Stack>
    </Stack>
  )

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
  )

  const onDelete = async (id: string) => {
    await deleteNotification(id)
  }

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
    )
  }

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
        {typeOfNotification === NotificationCategories.TRANSFER && transferAction}
        {typeOfNotification === NotificationCategories.COMMENT && messageAction}
      </Stack>
    </ListItemButton>
  )
}
