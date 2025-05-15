// REACT IMPORTS
import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';

// REDUX IMPORTS
import { useDispatch } from 'react-redux';
import { closeLoginModal } from '@redux/auth';

// MUI IMPORTS
import { Box, Button, Grid, Input, TextField, Typography } from '@mui/material';

// PROJECTS IMPORTS
import Image from '../image';
import { ProfileData } from '@src/contexts/auth/types.ts';
import { uploadImageToIPFS } from '@src/libs/ipfs.ts'
import { buildProfileMetadata } from '@src/libs/profile.ts';
import TextMaxLine from '@src/components/text-max-line';
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';

// NOTIFICATIONS IMPORTS
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import { notifyError, notifySuccess } from '@src/libs/notifications/internal-notifications';
import { SUCCESS } from '@src/libs/notifications/success';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import {ProfileFormProps, ProfileFormValues} from "@src/components/login-modal/types.ts"
import { useCreateUserMutation, useUpdateUserMutation } from '@src/graphql/generated/hooks.tsx';
import { resolveSrc } from '@src/utils/image.ts';
import { getIpfsUri } from '@src/utils/publication.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';

// ----------------------------------------------------------------------

const getButtonLabel = (mode: 'register' | 'update') => {
  if (mode === 'register') {
    return 'Create profile';
  } else {
    return 'Update profile';
  }
};

export const ProfileFormView: React.FC<ProfileFormProps> = ({
  onSuccess,
  onCancel,
  initialValues,
  error,
  mode,
}) => {
  const dispatch = useDispatch();
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [createUser, { loading: createUserLoading, error: errorCreatingProfile }] = useCreateUserMutation();
  const [updateUser, { loading: updateUserLoading, error: errorUpdatingProfile }] = useUpdateUserMutation();
  const { session } = useAuth();
  const { refreshUser } = useAccountSession();

  const loading = createUserLoading || updateUserLoading || registrationLoading;
  const PaperElement = loading ? NeonPaper : Box;

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(5, 'Username must be at least 5 characters')
      .required('Username is required'),
    displayName: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
    bio: Yup.string().min(10, 'Bio must be at least 10 characters').required('Bio is required'),
    socialLinks: Yup.object({
      twitter: Yup.string().url('Enter a valid URL'),
      instagram: Yup.string().url('Enter a valid URL'),
      orb: Yup.string().url('Enter a valid URL'),
      farcaster: Yup.string().url('Enter a valid URL'),
    }),
  });

  useEffect(() => {
    if (errorCreatingProfile) notifyError(ERRORS.CREATING_PROFILE_ERROR);
    if (errorUpdatingProfile) notifyError(ERRORS.UPDATING_PROFILE_ERROR);
    if (error) notifyError(ERRORS.UNKNOWN_ERROR);
  }, [errorCreatingProfile, errorUpdatingProfile]);


  /**
   * Asynchronously converts a blob URL string to a File object and uploads it to IPFS.
   *
   * This function fetches the content from the provided blob URL, converts it to a Blob object,
   * creates a File object from that Blob, and uploads the File to IPFS using the `uploadImageToIPFS` method.
   *
   * @param {string} blobString - A string representing the blob URL to be converted and uploaded.
   * @returns {Promise<string|null>} A Promise that resolves to the IPFS URL or identifier of the uploaded file if successful,
   * or `null` if the operation fails.
   */
  const getBlobFileAndUploadToIPFS = async (blobString: string): Promise<string | null> => {
    try {
      const image = blobString.startsWith('ipfs') ? getIpfsUri(blobString) : blobString;
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'image-file', { type: blob.type });
      return await uploadImageToIPFS(file);
    } catch (error) {
      console.error('Error converting blob to File and uploading:', error);
      return null;
    }
  };

  const updateProfileMetadata = async (data: ProfileData) => {
    setRegistrationLoading(true);

    try {
      // Upload images to IPFS
      const profilePictureURI = await (typeof data?.profilePicture === 'string'
        ? getBlobFileAndUploadToIPFS(data.profilePicture)
        : uploadImageToIPFS(data.profilePicture));

      const coverPictureURI = await (typeof data?.coverPicture === 'string'
        ? getBlobFileAndUploadToIPFS(data.coverPicture)
        : uploadImageToIPFS(data.coverPicture));

      // Build profile metadata
      const metadata = buildProfileMetadata(data, profilePictureURI, coverPictureURI);

      await updateUser({
        variables: {
          input: {
            ...metadata
          },
        },
      });

      setRegistrationLoading(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating profile metadata:', error);
      setRegistrationLoading(false);
      dispatch(closeLoginModal());
    }
  };

  const registerProfile = useCallback(
    async (data: ProfileData) => {
      if (!session?.address) {
        console.error('Wallet address not available.');
        return;
      }
      if (!session?.info?.email) {
        console.error('Email is not available.');
        return;
      }

      try {
        setRegistrationLoading(true);

        // Upload images to IPFS
        const profilePictureURI = await (typeof data?.profilePicture === 'string'
          ? getBlobFileAndUploadToIPFS(data.profilePicture)
          : uploadImageToIPFS(data.profilePicture));

        const coverPictureURI = await (typeof data?.coverPicture === 'string'
          ? getBlobFileAndUploadToIPFS(data.coverPicture)
          : uploadImageToIPFS(data.coverPicture));

        // Build profile metadata
        const metadata = buildProfileMetadata(data, profilePictureURI, coverPictureURI);

        await createUser({
          variables: {
            input: {
              address: session?.address,
              ...metadata
            },
          },
        });

        setRegistrationLoading(false);
        notifySuccess(SUCCESS.PROFILE_CREATED_SUCCESSFULLY);
        setTimeout(refreshUser, 100)
        onSuccess();
      } catch (error) {
        console.error('Error during profile registration:', error);
        setRegistrationLoading(false);
        throw error;
      }
    },
    [session?.address]
  );

  const formik = useFormik<ProfileFormValues>({
    initialValues: initialValues ?? {
      username: '',
      displayName: '',
      bio: '',
      profilePicture: null,
      coverPicture: null,
      socialLinks: {
        twitter: '',
        instagram: '',
        orb: '',
        farcaster: '',
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (mode === 'register') {
          await registerProfile(values);
        } else if (mode === 'update') {
          await updateProfileMetadata(values);
        }
      } catch (error) {
        console.error('Error registering profile', error);
        // @ts-expect-error No error in this context
        console.error(error.message);
        // @ts-expect-error No error in this context
        setErrorMessage(error.message || 'Ocurrió un error durante el registro.');
      }
    },
  });

  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const coverPictureInputRef = useRef<HTMLInputElement>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [coverPicturePreview, setCoverPicturePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      formik.setFieldValue(field, file);

      // Create an object URL for preview
      const previewUrl = URL.createObjectURL(file);

      if (field === 'profilePicture') {
        setProfilePicturePreview(previewUrl);
      } else if (field === 'coverPicture') {
        setCoverPicturePreview(previewUrl);
      }
    }
  };

  return (
    <Box sx={{ p: 2, overflow: 'hidden', overflowY: 'scroll', zIndex: '1000', maxHeight: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          pb: 2,
          position: 'sticky',
          top: '-17px',
          zIndex: 10,
          background: '#212b36',
          marginTop: '-17px',
          paddingTop: '16px',
        }}
      >
        {mode === 'register' ? 'Create a new profile' : 'Update profile'}
      </Typography>
      {/* Hidden inputs for image uploads */}
      <Input
        type="file"
        inputProps={{
          accept: 'image/*',
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileChange(event, 'coverPicture')}
        inputRef={coverPictureInputRef}
        sx={{ display: 'none' }}
      />
      <Input
        inputProps={{
          accept: 'image/*',
        }}
        type="file"
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileChange(event, 'profilePicture')}
        inputRef={profilePictureInputRef}
        sx={{ display: 'none' }}
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box sx={{ width: '100%', position: 'relative', pt: 1 }}>
          {/* Background Image */}
          <Image
            src={coverPicturePreview ?? resolveSrc((initialValues?.coverPicture || session?.address) ?? '', 'cover') ?? ''}
            onClick={() => coverPictureInputRef.current?.click()}
            sx={{
              height: 120,
              width: '100%',
              opacity: 0.7,
              color: 'common.white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid #fff',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.03)',
                border: '2px solid #fff',
                opacity: 1,
              },
            }}
          />
          {/* Avatar */}
          <AvatarProfile
            src={profilePicturePreview || resolveSrc(initialValues?.profilePicture || session.address || '', 'profile') || ''}
            alt=""
            onClick={() => profilePictureInputRef.current?.click()}
            sx={{
              width: 60,
              height: 60,
              opacity: 0.9,
              ml: 2,
              mt: -3,
              cursor: 'pointer',
              border: '1px solid #fff',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                border: '2px solid #fff',
                opacity: 1,
              },
            }}
            variant="rounded"
          />
          <Box
            sx={{
              display: 'flex',
              marginTop: 10,
              flexDirection: 'column',
              alignItems: {
                xs: 'flex-start',
                sm: 'flex-end',
              },
              justifyContent: {
                xs: 'flex-start',
                sm: 'flex-end',
              },
              position: 'absolute',
              width: '100%',
              bottom: {
                xs: -50,
                sm: -8,
              },
              right: 0,
              opacity: 0.7,
            }}
          >
            <TextMaxLine line={1} variant="caption" fontWeight="bold" color="text.secondary">
              * Click the profile or cover image to select one
            </TextMaxLine>
            <TextMaxLine line={1} variant="caption" fontWeight="bold" color="text.secondary">
              * Images are optional (current images are placeholders)
            </TextMaxLine>
          </Box>
        </Box>

        {/* Text Fields */}
        <Grid
          container
          spacing={2}
          sx={{
            mt: {
              xs: 6,
              sm: 2,
            },
          }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              id="displayName"
              name="displayName"
              placeholder="Enter your name"
              value={formik.values.displayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={formik.touched.displayName && Boolean(formik.errors.displayName)}
              helperText={formik.touched.displayName && formik.errors.displayName ? formik.errors.displayName : 'e.g., John Doe'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              id="username"
              name="username"
              placeholder="Enter a username"
              disabled={mode === 'update' || loading}
              value={formik.values.username}
              onChange={(event) => {
                const lowercaseValue = event.target.value.toLowerCase();
                formik.setFieldValue('username', lowercaseValue);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username ? formik.errors.username : 'e.g., johndoe123'}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Bio"
          variant="outlined"
          id="bio"
          name="bio"
          placeholder="Tell us about yourself"
          value={formik.values.bio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loading}
          multiline
          rows={4}
          sx={{ mt: 2 }}
          error={formik.touched.bio && Boolean(formik.errors.bio)}
          helperText={formik.touched.bio && formik.errors.bio ? formik.errors.bio : 'Share something about yourself'}
        />

        {/* Link Social Networks */}
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
          Your social networks links
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Twitter"
              variant="outlined"
              id="socialLinks.twitter"
              name="socialLinks.twitter"
              placeholder="e.g., https://twitter.com/yourhandle"
              value={formik.values.socialLinks.twitter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={
                formik.touched.socialLinks?.twitter && Boolean(formik.errors.socialLinks?.twitter)
              }
              helperText={
                formik.touched.socialLinks?.twitter ? formik.errors.socialLinks?.twitter : ''
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Instagram"
              variant="outlined"
              id="socialLinks.instagram"
              name="socialLinks.instagram"
              placeholder="e.g., https://instagram.com/yourprofile"
              value={formik.values.socialLinks.instagram}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={
                formik.touched.socialLinks?.instagram &&
                Boolean(formik.errors.socialLinks?.instagram)
              }
              helperText={
                formik.touched.socialLinks?.instagram ? formik.errors.socialLinks?.instagram : ''
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Orb.club"
              variant="outlined"
              id="socialLinks.orb"
              name="socialLinks.orb"
              placeholder="e.g., https://orb.club/yourprofile"
              value={formik.values.socialLinks.orb}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={formik.touched.socialLinks?.orb && Boolean(formik.errors.socialLinks?.orb)}
              helperText={formik.touched.socialLinks?.orb ? formik.errors.socialLinks?.orb : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Farcaster"
              variant="outlined"
              id="socialLinks.farcaster"
              name="socialLinks.farcaster"
              placeholder="e.g., https://farcaster.xyz/yourhandle"
              value={formik.values.socialLinks.farcaster}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={
                formik?.touched?.socialLinks?.farcaster &&
                Boolean(formik.errors.socialLinks?.farcaster)
              }
              helperText={
                formik?.touched?.socialLinks?.farcaster ? formik.errors.socialLinks?.farcaster : ''
              }
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            mb: 2,
            mt: 4,
          }}
        />

        {/* Action Buttons */}
        <Grid
          container
          spacing={2}
          sx={{
            position: 'sticky',
            bottom: '-17px',
            background: '#212b36',
            zIndex: 1,
            paddingBottom: '16px',
            marginBottom: '-17px',
          }}
        >
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{ width: '100%', py: 1 }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperElement
              {...(loading && {
                padding: '0',
              })}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  width: '100%',
                  py: 1,
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: loading ? 'none' : '1px solid white',
                }}
              >
                {getButtonLabel(mode)}
              </Button>
            </PaperElement>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
