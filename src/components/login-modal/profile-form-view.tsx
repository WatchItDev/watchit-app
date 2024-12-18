// REACT IMPORTS
import React, { useCallback, useEffect, useRef, useState } from 'react';

// MUI IMPORTS
import { Typography, Button, TextField, Box, Input, Grid } from '@mui/material';

// FORM IMPORTS
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@mui/material/Avatar';
import { Profile } from '@lens-protocol/api-bindings';
import Image from '../image';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import {
  SessionType,
  useCreateProfile,
  LoginError,
  useSetProfileMetadata,
} from '@lens-protocol/react-web';

import { ProfileData } from '@src/auth/context/web3Auth/types.ts';
import { uploadImageToIPFS, uploadMetadataToIPFS } from '@src/utils/ipfs.ts';
import { buildProfileMetadata } from '@src/utils/profile.ts';
import TextMaxLine from '@src/components/text-max-line';
import { useSnackbar } from 'notistack';
import {useDispatch, useSelector} from "react-redux";
import { setProfileCreationStep, resetCurrentStep, closeLoginModal, updateProfileData, setIsUpdatingMetadata } from "@redux/auth";
import NeonPaper from '@src/sections/publication/NeonPaperContainer';
import {RootState} from "@reduxjs/toolkit/query";
import uuidv4 from '@src/utils/uuidv4.ts';
// ----------------------------------------------------------------------

export interface ProfileFormProps {
  address: string;
  initialValues?: any;
  mode: 'register' | 'update';
  error?: LoginError;
  onSuccess: () => void;
  onCancel: () => void;
  login?: (profile?: Profile) => Promise<void>;
}

// ----------------------------------------------------------------------
const getButtonLabel = (mode: 'register' | 'update', step: number) => {
  if (mode === 'register') {
    switch (step) {
      case 1:
        return 'Creating profile...';
      case 2:
        return 'Storing data on blockchain...';
      case 3:
        return 'Finalizing...';
      default:
        return 'Create profile';
    }
  } else {
    return 'Update profile';
  }
};

export const ProfileFormView: React.FC<ProfileFormProps> = ({
  onSuccess,
  onCancel,
  initialValues,
  address,
  login,
  error,
  mode,
}) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  // @ts-ignore
  const { currentStep } = useSelector((state: RootState) => state.auth);

  const PaperElement = currentStep !== 0 ? NeonPaper : Box;

  // Pending metadata update (used when profile creation requires authentication)
  const [pendingMetadataUpdate, setPendingMetadataUpdate] = useState<{
    data: ProfileData;
    profile: Profile;
  } | null>(null);

  const sessionData = useSelector((state: any) => state.auth.session);
  // Create profile and set profile metadata functions from Lens Protocol
  const {
    execute: createProfileExecute,
    error: errorCreateProfile,
    loading: createProfileLoading,
  } = useCreateProfile();
  const {
    execute: setProfileMetadataExecute,
    error: errorSetProfileMetadata,
    loading: setProfileMetadataLoading,
  } = useSetProfileMetadata();
  const loading = createProfileLoading || setProfileMetadataLoading || registrationLoading;

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(5, 'Username must be at least 5 characters')
      .required('Username is required'),
    name: Yup.string().required('Name is required'),
    bio: Yup.string().required('Bio is required'),
    socialLinks: Yup.object({
      twitter: Yup.string().url('Enter a valid URL'),
      instagram: Yup.string().url('Enter a valid URL'),
      orb: Yup.string().url('Enter a valid URL'),
      farcaster: Yup.string().url('Enter a valid URL'),
    }),
  });

  useEffect(() => {
    if (errorCreateProfile) enqueueSnackbar(errorCreateProfile?.message, { variant: 'error' });
    if (errorSetProfileMetadata) enqueueSnackbar(errorSetProfileMetadata?.message, { variant: 'error' });
    if (error) enqueueSnackbar(error?.message, { variant: 'error' });
  }, [errorCreateProfile, errorSetProfileMetadata]);

  useEffect(() => {
    if (isSubmitting && !loading) {
      onSuccess();
      setIsSubmitting(false);
    }
  }, [isSubmitting, loading]);

  /**
   * Update profile metadata on the Lens Protocol.
   * @param data - Profile data to update.
   * @param profile - Profile to update.
   */
  const updateProfileMetadata = useCallback(
    async (data: ProfileData) => {
      setRegistrationLoading(true);

      dispatch(setIsUpdatingMetadata(true));

      try {
        dispatch(setProfileCreationStep({ step: 2 }));

        // Upload images to IPFS
        const profileImageURI =
          typeof data?.profileImage === 'string'
            ? data?.profileImage
            : await uploadImageToIPFS(data.profileImage);
        const backgroundImageURI =
          typeof data?.backgroundImage === 'string'
            ? data?.backgroundImage
            : await uploadImageToIPFS(data.backgroundImage);
        // Build profile metadata
        const metadata = buildProfileMetadata(data, profileImageURI, backgroundImageURI);
        // Upload metadata to IPFS
        const metadataURI = await uploadMetadataToIPFS(metadata);


        const profileImage =
          data.profileImage instanceof File ? URL.createObjectURL(data.profileImage) : profileImagePreview;
        const backgroundImage =
          data.backgroundImage instanceof File ? URL.createObjectURL(data.backgroundImage) : backgroundImagePreview;

        dispatch(
          updateProfileData({
            name: data.name,
            bio: data.bio,
            profileImage: profileImage,
            backgroundImage: backgroundImage,
            socialLinks: data?.socialLinks ?? [],
          })
        );

        dispatch({
          type: 'ADD_TASK_TO_BACKGROUND',
          payload: {
            id: uuidv4(),
            type: 'UPDATE_PROFILE_METADATA',
            data: {
              metadataURI,
              setProfileMetadataExecute,
              onSuccess: () => {
                enqueueSnackbar('Profile metadata updated successfully', { variant: 'success' });
                dispatch(setIsUpdatingMetadata(false));
              },
              onError: (error: any) => {
                enqueueSnackbar(`Error updating profile metadata: ${error.message}`, { variant: 'error' });
                dispatch(setIsUpdatingMetadata(false));
              },
            },
          },
        });

        setRegistrationLoading(false);
        dispatch(resetCurrentStep());
        dispatch(closeLoginModal());

        // // Update metadata on the Lens Protocol
        // const result = await setProfileMetadataExecute({ metadataURI });
        // if (result.isFailure()) {
        //   console.error('Failed to update metadata:', result.error.message);
        //   return;
        // }
        //
        // // Wait for the transaction to be processed
        // const completion = await result.value.waitForCompletion();
        // if (completion.isFailure()) {
        //   console.error('Error processing the transaction:', completion.error.message);
        //   return;
        // }
      } catch (error) {
        console.error('Error updating profile metadata:', error);
        setRegistrationLoading(false);
        dispatch(closeLoginModal());
      }
    },
    [setProfileMetadataExecute, address]
  );

  /**
   * Register a new profile on the Lens Protocol.
   * @param data - Profile data for the new profile.
   */
  const registerProfile = useCallback(
    async (data: ProfileData) => {
      if (!address) {
        console.error('Wallet address not available.');
        return;
      }

      try {
        dispatch(setProfileCreationStep({ step: 1 }));
        setRegistrationLoading(true);

        const result = await createProfileExecute({
          localName: data.username,
          to: address,
        });

        if (result.isFailure()) {
          throw new Error(result.error.message);
        }

        console.log('Profile registered');
        const newProfile: Profile = result.value;

        console.log('newProfile', newProfile);

        // Authenticate using the new profile
        await login?.(newProfile);

        dispatch(setProfileCreationStep({ step: 1 }));
        dispatch(setProfileCreationStep({ step: 2 }));

        // Save the pending metadata update
        setPendingMetadataUpdate({ data, profile: newProfile });

      } catch (error) {
        console.error('Error during profile registration:', error);
        setRegistrationLoading(false);
        throw error;
      }
    },
    [address, createProfileExecute]
  );

  const formik: any = useFormik({
    initialValues: initialValues ?? {
      username: '',
      name: '',
      bio: '',
      profileImage: null,
      backgroundImage: null,
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
        setIsSubmitting(true);
        if (mode === 'register') {
          await registerProfile(values);
        } else if (mode === 'update') {
          await updateProfileMetadata(values);
        }
      } catch (error) {
        console.error('Error registering profile', error);
        // @ts-ignore
        console.error(error.message);
        // @ts-ignore
        setErrorMessage(error.message || 'Ocurrió un error durante el registro.');
      }
    },
  });

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      formik.setFieldValue(field, file);

      // Create an object URL for preview
      const previewUrl = URL.createObjectURL(file);

      if (field === 'profileImage') {
        setProfileImagePreview(previewUrl);
      } else if (field === 'backgroundImage') {
        setBackgroundImagePreview(previewUrl);
      }
    }
  };

  // Handle session changes and resume pending metadata updates
  useEffect(() => {
    // Resume metadata update if pending and authenticated
    if (
      sessionData?.authenticated &&
      sessionData.type === SessionType.WithProfile &&
      pendingMetadataUpdate
    ) {
      console.log('data pending', pendingMetadataUpdate);
      updateProfileMetadata(pendingMetadataUpdate.data);
      setPendingMetadataUpdate(null); // Clear the pending update
    }
  }, [sessionData, pendingMetadataUpdate, updateProfileMetadata]);

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
        onChange={(event: any) => handleFileChange(event, 'backgroundImage')}
        inputRef={backgroundImageInputRef}
        sx={{ display: 'none' }}
      />
      <Input
        type="file"
        onChange={(event: any) => handleFileChange(event, 'profileImage')}
        inputRef={profileImageInputRef}
        sx={{ display: 'none' }}
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box sx={{ width: '100%', position: 'relative' }}>
          {/* Background Image */}
          <Image
            src={
              backgroundImagePreview ??
              (initialValues?.backgroundImage
                ? `https://ipfs.io/ipfs/${initialValues?.backgroundImage?.replaceAll?.('ipfs://', '')}`
                : `https://picsum.photos/seed/${mode === 'update' && sessionData?.authenticated ? sessionData?.profile?.id : 'new'}/1920/820`)
            }
            onClick={() => backgroundImageInputRef.current?.click()}
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
          <Avatar
            src={
              profileImagePreview ??
              (initialValues?.profileImage
                ? `https://ipfs.io/ipfs/${initialValues?.profileImage?.replaceAll?.('ipfs://', '')}`
                : `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${mode === 'update' && sessionData?.authenticated ? sessionData?.profile?.id : 'new'}`)
            }
            alt=""
            onClick={() => profileImageInputRef.current?.click()}
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
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name ? formik.errors.name : 'e.g., John Doe'}
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
              helperText={formik.touched.username ? formik.errors.username : 'e.g., johndoe123'}
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
          helperText={formik.touched.bio ? formik.errors.bio : 'Share something about yourself'}
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
            <PaperElement padding={'0'} colors={['rgba(30,135,255,0.5)', 'rgba(92,19,196,0.5)', 'rgba(255,0,51,0.5)', 'rgba(255,218,0,0.5)', 'rgba(100,188,38,0.5)', 'rgba(30,135,255,0.5)']} animationSpeed="2s">
              <Button
                disabled={currentStep !== 0}
                variant="contained"
                type="submit"
                sx={{ width: '100%', py: 1, backgroundColor: 'transparent', color: 'white', border: currentStep ? 'none': '1px solid white' }}
              >
                {getButtonLabel(mode, currentStep)}
              </Button>
            </PaperElement>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
