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
import { uploadMetadataToIPFS } from '@src/utils/ipfs';
import uuidv4 from '@src/utils/uuidv4.ts';
import { useDispatch } from 'react-redux';
import { refetchCommentsByPublication } from '@redux/comments';
import { useNotifications } from "@src/hooks/use-notifications.ts";
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';


import { ethers } from "ethers";
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";

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

  const dispatch = useDispatch();
  const { execute: createComment, error, loading } = useCreateComment();
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);

  const onSubmit = handleSubmit(async (data) => {
    // TODO move to metadata.js <- functions to create all these meta
    const metadata = textOnly({
      appId: 'watchit',
      id: uuidv4(),
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
        external_url: `https://watchit.movie/comment/${uuidv4()}`,
      }
    });

    // Validate metadata against the schema
    const validation = PublicationMetadataSchema.safeParse(metadata);
    if (!validation.success) {
      console.error('Metadata validation error:', formatZodError(validation.error));
      return;
    }

    const connectIrys = async () => {

      const provider = new ethers.BrowserProvider(window.ethereum);
      const irysUploader = await WebUploader(WebEthereum).withAdapter(EthersV6Adapter(provider));
      setIrysStatus(`Connected to Irys: ${irysUploader.address}`);

    };

    // Upload metadata to IPFS
    const uri = await uploadMetadataToIPFS(metadata);
    // Create comment with retry logic
    const result: any = await createComment({
      commentOn: commentOn as any,
      metadata: uri,
    }).then(() => {
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

    if (result.isFailure()) {
      console.error('Error creating the comment:', error?.message);
      return;
    }

    const completion = await result.value.waitForCompletion();
    if (completion.isFailure()) {
      console.log('There was an processing the transaction', completion.error.message);
      return;
    }

    // If execution reaches here, the comment was created successfully
    console.log('Comment created successfully', completion?.value);
    dispatch(refetchCommentsByPublication(commentOn));
    reset(); // Reset the form

  });


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack sx={{ pr: 1 }} spacing={2} direction="row" alignItems="center">
        <Avatar
          alt={sessionData?.profile?.handle?.localName ?? ''}
          src={
            (sessionData?.profile?.metadata?.picture as any)?.optimized?.uri ??
            `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${sessionData?.profile?.id}`
          }
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
                    loading={isSubmitting || loading}
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
    </FormProvider>
  );
};

export default MovieCommentForm;
