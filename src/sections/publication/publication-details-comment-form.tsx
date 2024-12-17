import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { ProfileSession, useCreateComment, useSession } from '@lens-protocol/react-web';
import {
  textOnly,
  PublicationMetadataSchema,
  formatZodError,
  MetadataAttributeType,
  MarketplaceMetadataAttributeDisplayType,
} from '@lens-protocol/metadata';
import FormProvider from '@src/components/hook-form';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha } from '@mui/material/styles';
import Iconify from '@src/components/iconify';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { uploadMetadataToIPFS, verifyIpfsData } from '@src/utils/ipfs';
import uuidv4 from '@src/utils/uuidv4.ts';
import { useDispatch } from 'react-redux';
import {
  refetchCommentsByPublication,
  addPendingComment,
  removePendingComment
} from '@redux/comments';
import {useNotifications} from "@src/hooks/use-notifications.ts";
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';
import {AnyPublication} from "@lens-protocol/api-bindings";

// Define the props types
type MovieCommentFormProps = {
  root?: any; // ID of the root publication (post or comment)
  commentOn: string; // ID of the publication (post or comment) to comment on
  owner: {
    id: string;
    displayName: string;
    avatar?: string;
  }
};

/**
 * MovieCommentForm Component
 *
 * @param {MovieCommentFormProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */
const MovieCommentForm = ({ commentOn, owner, root }: MovieCommentFormProps) => {
  // Define the validation schema using Yup
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
  });

  // Define default form values
  const defaultValues = {
    comment: '',
  };

  // Initialize the form methods
  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { execute: createComment } = useCreateComment();
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const dispatch = useDispatch();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);

  const executeCreateCommentWithRetry = async (
    createComment: any,
    params: any,
    retries = 4,
    delayMs = 3000
  ): Promise<any> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await createComment(params);
        if (!result.isFailure()) {
          return result;
        } else {
          console.warn(`Attempt ${attempt}: Failed to create comment. Error: ${result.error.message}`);
        }
      } catch (error: any) {
        console.warn(`Attempt ${attempt}: Error creating comment. Error: ${error.message}`);
      }

      if (attempt < retries) {
        console.log(`Retrying in ${delayMs}ms... (${attempt}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error(`Could not create the comment after ${retries} attempts.`);
  };

  /**
   * Form submission handler.
   *
   * @param {any} data - Form data.
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      // HAbilitar el efecto en el comentario
      const uuid = uuidv4();

      const metadata = textOnly({
        appId: 'watchit',
        id: uuid,
        attributes: [
          { type: MetadataAttributeType.STRING, key: 'publication', value: commentOn },
          { type: MetadataAttributeType.STRING, key: 'creator', value: sessionData?.profile?.handle?.localName },
          { type: MetadataAttributeType.STRING, key: 'app', value: 'watchit' },
        ],
        content: data.comment,
        locale: 'en',
        marketplace: {
          name: `Comment by ${sessionData?.profile?.handle?.localName}`,
          attributes: [
            { display_type: MarketplaceMetadataAttributeDisplayType.STRING, value: commentOn },
            { display_type: MarketplaceMetadataAttributeDisplayType.STRING, value: sessionData?.profile?.handle?.localName },
            { display_type: MarketplaceMetadataAttributeDisplayType.STRING, value: 'watchit' },
          ],
          description: data.comment,
          external_url: `https://watchit.movie/comment/${uuid}`,
        }
      });

      // Create a pending comment object
      const pendingComment: AnyPublication = {
        // @ts-ignore
        id: uuid as string,
        // @ts-ignore
        metadata: {
          content: data.comment,
        },
        // @ts-ignore
        operations: {
          hasUpvoted: false
        },

        by: sessionData?.profile,
        createdAt: new Date().toISOString(),
      };

      // Validate metadata against the schema
      const validation = PublicationMetadataSchema.safeParse(metadata);
      if (!validation.success) {
        console.error('Metadata validation error:', formatZodError(validation.error));
        return;
      }

      // Upload metadata to IPFS
      const uri = await uploadMetadataToIPFS(metadata);

      // Send to redux the pending comment
      // Dispatch the addPendingComment action
      dispatch(addPendingComment({ publicationId: commentOn, comment: {...pendingComment, uri}}));
      // Reset
      reset(); // Reset the form
      // Verify availability of metadata on IPFS / Retries

      // Eliminar el efecto

      await verifyIpfsData(uri);

      // Create comment with retry logic
      await executeCreateCommentWithRetry(createComment, {
        commentOn: commentOn as any,
        metadata: uri,
      }).then(() => {
        // Update the comment status to confirmed
        dispatch(removePendingComment({ publicationId: commentOn, commentId: pendingComment.id}));
        // Send notifications to the author of the publication
        const notificationPayload = generatePayload('COMMENT', {
          id: owner?.id,
          displayName: owner?.displayName,
          avatar: owner?.avatar,
        }, {
          root_id: root,
          comment_id: commentOn,
          rawDescription: `${sessionData?.profile?.metadata?.displayName} left a comment`,
        });

        // Only notify the author if the comment is not on their own publication
        if (owner?.id !== sessionData?.profile?.id) {
          sendNotification(owner.id, sessionData?.profile?.id, notificationPayload);
        }
      });

      // If execution reaches here, the comment was created successfully
      console.log('Comment created successfully');
      reset(); // Reset the form
      dispatch(refetchCommentsByPublication(commentOn));
    } catch (e: any) {
      console.error('Error creating the comment:', e.message);

      // Handle specific failure scenarios if necessary
      if (e.message.includes('BroadcastingError')) {
        console.log('Error broadcasting the transaction:', e.message);
      } else if (e.message.includes('PendingSigningRequestError')) {
        console.log(
          'There is a pending signature request in your wallet. ' +
          'Approve it or dismiss it and try again.'
        );
      } else if (e.message.includes('WalletConnectionError')) {
        console.log('Error connecting to the wallet:', e.message);
      } else if (e.message.includes('UserRejectedError')) {
        // The user decided not to sign
      } else {
        console.log('Error:', e.message);
      }
    }
  });

  const renderInput = (
    <Stack sx={{ pr: 1 }} spacing={2} direction="row" alignItems="center">
      <Avatar
        src={
          (sessionData?.profile?.metadata?.picture as any)?.optimized?.uri ??
          `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${sessionData?.profile?.id}`
        }
        alt={sessionData?.profile?.handle?.localName ?? ''}
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
