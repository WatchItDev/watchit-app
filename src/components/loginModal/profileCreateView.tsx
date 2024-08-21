// REACT IMPORTS
import React from 'react';

// MUI IMPORTS
import {
  Typography,
  Button,
  TextField,
} from '@mui/material';

// FORM IMPORTS
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface NewProfileData {
  username: string,
  name: string,
  bio: string
}

export interface ProfileCreateProps {
  onCreate: (data: NewProfileData) => void;
  onCancel: () => void;
}

// ----------------------------------------------------------------------

export const ProfileCreateView: React.FC<ProfileCreateProps> = ({ onCreate, onCancel }) => {

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(5, 'Username must be at least 5 characters long')
      .required('Username is required'),
    name: Yup.string()
      .required('Full name is required'),
    bio: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      bio: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onCreate(values);
      formik.resetForm();
    },
  });

  return (
    <>
      <Typography variant="h6" sx={{ pb: 2 }}>
        Create a New Profile
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          id="username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          fullWidth
          label="Full name"
          variant="outlined"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          label="Bio"
          variant="outlined"
          id="bio"
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={formik.touched.bio && Boolean(formik.errors.bio)}
          helperText={formik.touched.bio && formik.errors.bio}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={onCancel} sx={{ width: '45%', py: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" sx={{ width: '45%', py: 1 }}>
            Create Profile
          </Button>
        </Box>
      </form>
    </>
  )
}
