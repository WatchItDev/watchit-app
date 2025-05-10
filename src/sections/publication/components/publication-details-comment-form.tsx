// REDUX IMPORTS
import { useDispatch } from 'react-redux';

// FORM IMPORTS
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// MUI IMPORTS
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import FormProvider from '@src/components/hook-form';
import { alpha } from '@mui/material/styles';
import { Stack, CircularProgress } from '@mui/material';

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';
import { MovieCommentFormProps } from '@src/sections/publication/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { resolveSrc } from '@src/utils/image.ts';
import { useCreateCommentMutation } from '@src/graphql/generated/hooks.tsx';
import { refetchCommentsByPublication } from '@redux/comments';

/**
 * MovieCommentForm Component
 *
 * @param {MovieCommentFormProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */
const MovieCommentForm = ({ commentOn, owner, root }: MovieCommentFormProps) => {
  const [createComment] = useCreateCommentMutation();
  const { session: sessionData } = useAuth();
  const dispatch = useDispatch();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);

  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
  });
  const defaultValues = { comment: '' };
  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Form submission handler.
   *
   * @param {any} data - Form data.
   */
  const onSubmit = handleSubmit(async (data: {comment:string}) => {
    try {
      await createComment({
        variables: {
          input: {
            content: data.comment,
            postId: root,
            parentComment: commentOn
          }
        }
      });

      const notificationPayload = generatePayload(
        'COMMENT',
        {
          id: owner?.id,
          displayName: owner?.displayName,
          avatar: owner.avatar ?? '',
        },
        {
          comment: data.comment,
          root_id: root ?? '',
          comment_id: commentOn ?? '',
          rawDescription: `${sessionData?.user?.displayName} left a comment`,
        }
      );

      // Send the notification if the comment is not from the owner
      if (owner?.id !== sessionData?.user?.address) {
        sendNotification(owner.id, sessionData?.user?.address ?? '', notificationPayload);
      }

      // Refetch the comments
      dispatch(refetchCommentsByPublication(commentOn ?? root ?? ''));

      reset();
    } catch (error) {
      // @ts-expect-error No error type
      console.error('Error creating the comment:', error.message);
    }
  });

  const renderInput = (
    <Stack sx={{ pr: 1 }} spacing={2} direction="row" alignItems="center">
      <AvatarProfile
        src={resolveSrc((sessionData?.user?.profilePicture || sessionData?.user?.address) ?? '', 'profile')}
        alt={sessionData?.user?.displayName ?? ''}
      />

      <Controller
        name="comment"
        control={methods.control}
        render={({ field }) => (
          <InputBase
            fullWidth
            {...field}
            placeholder="Write a comment…"
            endAdornment={
              <InputAdornment position="end" sx={{ mr: 1 }}>
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  loadingIndicator={<CircularProgress color="inherit" size={20} />}
                  sx={{
                    padding: 0.5,
                    minWidth: 'auto',
                    color: 'inherit',
                  }}
                >
                  <Iconify icon="eva:paper-plane-fill" />
                </LoadingButton>
              </InputAdornment>
            }
            sx={{
              pl: 1.5,
              height: 40,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
            }}
          />
        )}
      />
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderInput}
    </FormProvider>
  );
};

export default MovieCommentForm;
