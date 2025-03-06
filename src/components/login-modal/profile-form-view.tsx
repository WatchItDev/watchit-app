// REACT IMPORTS
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import {
  closeLoginModal,
  resetCurrentStep,
  setIsUpdatingMetadata,
  setProfileCreationStep,
  updateProfileData,
} from '@redux/auth';

// MUI IMPORTS
import { Box, Button, Grid, Input, TextField, Typography } from '@mui/material';

// PROJECTS IMPORTS
import Image from '../image';
import { ProfileData } from '@src/auth/context/web3Auth/types.ts';
import {getFileFromBlob, uploadImageToIPFS, uploadMetadataToIPFS} from '@src/utils/ipfs.ts'
import { buildProfileMetadata } from '@src/utils/profile.ts';
import TextMaxLine from '@src/components/text-max-line';
import NeonPaper from '@src/sections/publication/NeonPaperContainer';
import uuidv4 from '@src/utils/uuidv4';

// LENS IMPORTS
import { Profile } from '@lens-protocol/api-bindings';
import {
  LoginError,
  SessionType,
  useCreateProfile,
  useSetProfileMetadata,
} from '@lens-protocol/react-web';

// NOTIFICATIONS IMPORTS
import { notifyError, notifySuccess } from '@notifications/internal-notifications';
import { SUCCESS } from '@notifications/success';
import { ERRORS } from '@notifications/errors.ts';
import AvatarProfile from "@src/components/avatar/avatar.tsx";

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
        return 'Creating';
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
    name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
    bio: Yup.string().min(10, 'Bio must be at least 10 characters').required('Bio is required'),
    socialLinks: Yup.object({
      twitter: Yup.string().url('Enter a valid URL'),
      instagram: Yup.string().url('Enter a valid URL'),
      orb: Yup.string().url('Enter a valid URL'),
      farcaster: Yup.string().url('Enter a valid URL'),
    }),
  });

  useEffect(() => {
    if (errorCreateProfile) notifyError(ERRORS.CREATING_PROFILE_ERROR);
    if (errorSetProfileMetadata) notifyError(ERRORS.UPDATING_PROFILE_ERROR);
    if (error) notifyError(ERRORS.UNKNOWN_ERROR);
  }, [errorCreateProfile, errorSetProfileMetadata]);


  const getBlobFileAndUploadToIPFS = async (blobString: string): Promise<string | null> => {
    try {
      const response = await fetch(blobString);
      const blob = await response.blob();
      const file = new File([blob], 'image-file', { type: blob.type });
      return await uploadImageToIPFS(file);
    } catch (error) {
      console.error('Error converting blob to File and uploading:', error);
      return null;
    }
  };

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
        const profileImageURI = await (typeof data?.profileImage === 'string'
          ? getBlobFileAndUploadToIPFS(data.profileImage)
          : uploadImageToIPFS(data.profileImage));

        const backgroundImageURI = await (typeof data?.backgroundImage === 'string'
          ? getBlobFileAndUploadToIPFS(data.backgroundImage)
          : uploadImageToIPFS(data.backgroundImage));

        // Build profile metadata
        const metadata = buildProfileMetadata(data, profileImageURI, backgroundImageURI);
        // Upload metadata to IPFS
        const metadataURI = await uploadMetadataToIPFS(metadata);

        const profileImage =
          data.profileImage instanceof File
            ? URL.createObjectURL(data.profileImage)
            : profileImagePreview;
        const backgroundImage =
          data.backgroundImage instanceof File
            ? URL.createObjectURL(data.backgroundImage)
            : backgroundImagePreview;

        dispatch(
          updateProfileData({
            name: data.name,
            bio: data.bio,
            profileImage: profileImage ?? sessionData?.profile?.metadata?.picture?.optimized?.uri,
            backgroundImage:
              backgroundImage ?? sessionData?.profile?.metadata?.coverPicture?.optimized?.uri,
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
                notifySuccess(SUCCESS.PROFILE_METADATA_UPDATED);
                dispatch(setIsUpdatingMetadata(false));
              },
              onError: (error: any) => {
                console.log('Error updating profile metadata:', error);
                notifyError(ERRORS.UPDATING_PROFILE_ERROR);
                dispatch(setIsUpdatingMetadata(false));
              },
            },
          },
        });

        setRegistrationLoading(false);
        dispatch(resetCurrentStep());
        onSuccess();
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

        const newProfile: Profile = result.value;

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
        inputProps={{
          accept: 'image/*',
        }}
        onChange={(event: any) => handleFileChange(event, 'backgroundImage')}
        inputRef={backgroundImageInputRef}
        sx={{ display: 'none' }}
      />
      <Input
        inputProps={{
          accept: 'image/*',
        }}
        type="file"
        onChange={(event: any) => handleFileChange(event, 'profileImage')}
        inputRef={profileImageInputRef}
        sx={{ display: 'none' }}
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box sx={{ width: '100%', position: 'relative', pt: 1 }}>
          {/* Background Image */}
          <Image
            src={
              backgroundImagePreview ??
              (initialValues?.backgroundImage
                ? initialValues?.backgroundImage
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
          <AvatarProfile
            src={
              profileImagePreview ??
              (initialValues?.profileImage
                ? initialValues?.profileImage
                : mode === 'update' && sessionData?.authenticated ? sessionData?.profile?.id : 'new')
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
            <PaperElement
              {...(currentStep !== 0 && {
                padding: '0',
              })}
            >
              <Button
                disabled={currentStep !== 0}
                variant="contained"
                type="submit"
                sx={{
                  width: '100%',
                  py: 1,
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: currentStep ? 'none' : '1px solid white',
                }}
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
