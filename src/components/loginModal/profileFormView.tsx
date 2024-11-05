// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react';

// MUI IMPORTS
import {
  Typography,
  Button,
  TextField,
  Box,
  Input,
  Grid,
} from '@mui/material';

// FORM IMPORTS
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '@src/hooks/use-auth';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Profile } from '@lens-protocol/api-bindings';
import Image from '../image';

// ----------------------------------------------------------------------

export interface ProfileFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  mode: 'register' | 'update';
  initialValues?: any;
}

// ----------------------------------------------------------------------

export const ProfileFormView: React.FC<ProfileFormProps> = ({ onSuccess, onCancel, mode, initialValues }) => {
  const { selectedProfile, registerProfile, updateProfileMetadata, loading} = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting && !loading && !errorMessage) {
      onSuccess();
      setIsSubmitting(false);
    }
  }, [isSubmitting, loading, onSuccess, errorMessage]);

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
        console.log('hello start registration')
        setIsSubmitting(true);
        if (mode === 'register') {
          await registerProfile(values);
        } else if (mode === 'update') {
          await updateProfileMetadata(values, selectedProfile as Profile);
        }
      } catch (error) {
        console.error('Error registering profile', error);
        console.error(error.message);
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

  const clearError = () => {
    setErrorMessage('')
    setIsSubmitting(false);
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ pb: 2 }}>
        {mode === 'register' ? 'Create a New Profile' : 'Update Profile'}
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
              backgroundImagePreview ?? (
                initialValues?.backgroundImage ?
                  `https://ipfs.io/ipfs/${initialValues?.backgroundImage?.replaceAll?.('ipfs://', '')}` :
                  `https://picsum.photos/seed/${mode === 'update' && selectedProfile ? selectedProfile?.id : 'new'}/1920/820`
              )
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
              profileImagePreview ?? (
                initialValues?.profileImage ?
                  `https://ipfs.io/ipfs/${initialValues?.profileImage?.replaceAll?.('ipfs://', '')}` :
                  `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${mode === 'update' && selectedProfile ? selectedProfile?.id : 'new'}`
              )
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
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              position: 'absolute',
              bottom: -8,
              right: 0,
              opacity: 0.7
            }}
          >
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
            >
              * Click the profile or cover image to select one
            </Typography>
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
            >
              * Images are optional (current images are placeholders)
            </Typography>
          </Box>
        </Box>

        {/* Text Fields */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
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
              onChange={formik.handleChange}
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
          Link Social Networks
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
              helperText={formik.touched.socialLinks?.twitter ? formik.errors.socialLinks?.twitter : ''}
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
              error={
                formik.touched.socialLinks?.orb && Boolean(formik.errors.socialLinks?.orb)
              }
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
                formik?.touched?.socialLinks?.farcaster && Boolean(formik.errors.socialLinks?.farcaster)
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" onClick={onCancel} disabled={loading} sx={{ width: '100%', py: 1 }}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LoadingButton variant="contained" type="submit" loading={loading} sx={{ width: '100%', py: 1 }}>
              {mode === 'register' ? 'Create Profile' : 'Update Profile'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
