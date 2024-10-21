import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import Paper from '@mui/material/Paper';
import MovieCommentForm from './movie-details-comment-form';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';

// ----------------------------------------------------------------------

type Props = {
  profileName: string;
  profileId: string;
  message: string;
  postedAt: Date;
  hasReply?: boolean;
  canReply?: boolean;
  commentId: string; // Current comment ID
};

export default function MovieCommentItem({
                                           profileName,
                                           profileId,
                                           message,
                                           postedAt,
                                           hasReply,
                                           canReply,
                                           commentId,
                                         }: Props) {
  const reply = useBoolean();
  const router = useRouter();

  const goToProfile = () => {
    router.push(paths.dashboard.user.root(profileId))
  }

  return (
    <Stack
      sx={{
        ...(hasReply && {
          pl: 8, // Indent replies
        }),
        ...(!hasReply && {
          pt: 2,
        })
      }}
      direction="column"
      spacing={2}
    >
      <Stack
        direction="row"
        spacing={2}
      >
         <Avatar
          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profileId}`}
          alt={profileName} onClick={goToProfile}
          sx={{
            width: 40,
            height: 40,
            cursor: 'pointer',
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
         />

        <Paper
          sx={{
            p: 1.5,
            pt: 0.7,
            flexGrow: 1,
            bgcolor: 'background.neutral',
          }}
        >
          <Stack
            sx={{ mb: 0.5 }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            direction={{ xs: 'column', sm: 'row' }}
          >
            <Box sx={{ typography: 'subtitle2' }}>{profileName}</Box>

            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
              <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
                {fDate(postedAt)}
              </Box>

              {(!hasReply && !!canReply) && (
                <Button
                  size="small"
                  color={reply.value ? 'primary' : 'inherit'}
                  startIcon={<Iconify icon="solar:pen-bold" width={16} />}
                  onClick={reply.onToggle}
                  sx={{ ml: 2 }}
                >
                  Reply
                </Button>
              )}
            </Box>
          </Stack>

          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{message}</Box>
        </Paper>
      </Stack>
      {reply.value && (
        <Box sx={{ mt: 1, mb: 2 }}>
          <MovieCommentForm commentOn={commentId} />
        </Box>
      )}
    </Stack>
  );
}
