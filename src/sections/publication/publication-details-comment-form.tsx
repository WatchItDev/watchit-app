import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

// Import from Lens SDK
import { useCreateComment } from '@lens-protocol/react-web';
import { textOnly } from '@lens-protocol/metadata';

// Custom components
import FormProvider from '@src/components/hook-form';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha } from '@mui/material/styles';
import Iconify from '../../components/iconify';
import { useAuth } from '../../hooks/use-auth';

// Define the props types
type MovieCommentFormProps = {
  commentOn: string; // ID of the publication (post or comment) to comment on
};

const MovieCommentForm = ({ commentOn }: MovieCommentFormProps) => {
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
  });

  const defaultValues = {
    comment: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Initialize useCreateComment
  const { execute: createComment } = useCreateComment();
  const { selectedProfile } = useAuth();

  // Implementation of uploadToIpfs using Pinata
  const uploadToIpfs = async (metadata: any) => {
    const pinataApiKey = '26e37a596e8e561427af'; // Replace with your API key
    const pinataSecretApiKey =
      '9d9469c678bb8db458851c5342f9201ab4811c29f281f7d8205a6a18cf302566'; // Replace with your secret API key

    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    try {
      const response = await axios.post(url, metadata, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      // Return the IPFS URI
      return `ipfs://${response.data.IpfsHash}`;
    } catch (e) {
      console.error('Error uploading to IPFS:', e);
      throw e;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const content = data.comment;

      // Create metadata using textOnly
      const metadata = textOnly({
        content,
        appId: 'watchit',
      });

      // Upload metadata to IPFS
      const uri = await uploadToIpfs(metadata);

      // Execute the comment creation
      const result = await createComment({
        commentOn: commentOn as any, // ID of the publication to comment on
        metadata: uri,
      });

      if (result.isFailure()) {
        // Handle failure scenarios
        switch (result.error.name) {
          case 'BroadcastingError':
            console.log('Error broadcasting the transaction', result.error.message);
            break;
          case 'PendingSigningRequestError':
            console.log(
              'There is a pending signature request in your wallet. ' +
              'Approve it or dismiss it and try again.'
            );
            break;
          case 'WalletConnectionError':
            console.log('Error connecting to the wallet', result.error.message);
            break;
          case 'UserRejectedError':
            // The user decided not to sign
            break;
          default:
            console.log('Error:', result.error.message);
            break;
        }
        return;
      }

      // Wait for the transaction to complete
      const completion = await result.value.waitForCompletion();

      if (completion.isFailure()) {
        console.log('Error processing the transaction', completion.error.message);
        return;
      }

      // The comment was created successfully
      const comment = completion.value;
      console.log('Comment created', comment);

      reset(); // Clear the form
    } catch (e) {
      console.error('Error creating the comment:', e);
    }
  });

  const renderInput = (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
    >
      <Avatar
        src={(selectedProfile?.metadata?.picture as any)?.optimized?.uri ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${selectedProfile?.id}`}
        alt={selectedProfile?.handle?.localName ?? ''}
      />

      {/* Usamos Controller para conectar InputBase con react-hook-form */}
      <Controller
        name="comment"
        control={methods.control}
        render={({ field }) => (
          <InputBase
            fullWidth
            {...field}
            placeholder="Escribe un comentario…"
            endAdornment={
              <InputAdornment position="end" sx={{ mr: 1 }}>
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  loadingIndicator={
                    <CircularProgress color="inherit" size={20} />
                  }
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