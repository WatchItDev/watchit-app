import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useCreateComment } from '@lens-protocol/react-web';
import {
  textOnly,
  PublicationMetadataSchema,
  formatZodError,
  MetadataAttributeType,
  MarketplaceMetadataAttributeDisplayType,
} from '@lens-protocol/metadata';
import FormProvider from '@src/components/hook-form';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha } from '@mui/material/styles';
import Iconify from '@src/components/iconify';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { uploadMetadataToIPFS } from '@src/utils/ipfs.ts';
import uuidv4 from '@src/utils/uuidv4.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';
import { AnyPublication } from '@lens-protocol/api-bindings';
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import {dicebear} from "@src/utils/dicebear.ts";
import { MovieCommentFormProps } from '@src/sections/publication/types.ts';

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
  const sessionData = useSelector((state: any) => state.auth.session);
  const dispatch = useDispatch();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);

  /**
   * Form submission handler.
   *
   * @param {any} data - Form data.
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      const uuid = uuidv4();

      const metadata = textOnly({
        appId: 'watchit',
        id: uuid,
        attributes: [
          { type: MetadataAttributeType.STRING, key: 'publication', value: commentOn },
          {
            type: MetadataAttributeType.STRING,
            key: 'creator',
            value: sessionData?.profile?.handle?.localName,
          },
          { type: MetadataAttributeType.STRING, key: 'app', value: 'watchit' },
        ],
        content: data.comment,
        locale: 'en',
        marketplace: {
          name: `Comment by ${sessionData?.profile?.handle?.localName}`,
          attributes: [
            { display_type: MarketplaceMetadataAttributeDisplayType.STRING, value: commentOn },
            {
              display_type: MarketplaceMetadataAttributeDisplayType.STRING,
              value: sessionData?.profile?.handle?.localName,
            },
            { display_type: MarketplaceMetadataAttributeDisplayType.STRING, value: 'watchit' },
          ],
          description: data.comment,
          external_url: `https://watchit.movie/comment/${uuid}`,
        },
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
          hasUpvoted: false,
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

      dispatch({
        type: 'ADD_TASK_TO_BACKGROUND',
        payload: {
          id: uuidv4(),
          type: 'POST_COMMENT',
          data: {
            commentOn,
            uri,
            pendingComment,
            createComment,
            owner,
            generatePayload,
            sendNotification,
            root,
          },
        },
      });

      reset();
    } catch (e: any) {
      console.error('Error creating the comment:', e.message);
    }
  });

  const renderInput = (
    <Stack sx={{ pr: 1 }} spacing={2} direction="row" alignItems="center">
      <AvatarProfile
        src={
          (sessionData?.profile?.metadata?.picture as any)?.optimized?.uri ?? dicebear(sessionData?.profile?.id)
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
