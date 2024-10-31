// // REACT IMPORTS
// import React from 'react';
//
// // MUI IMPORTS
// import {
//   Typography,
//   Button,
//   TextField,
// } from '@mui/material';
//
// // FORM IMPORTS
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import Box from '@mui/material/Box';
//
// // ----------------------------------------------------------------------
//
// export interface NewProfileData {
//   username: string,
//   name: string,
//   bio: string
// }
//
// export interface ProfileCreateProps {
//   onCreate: (data: NewProfileData) => void;
//   onCancel: () => void;
// }
//
// // ----------------------------------------------------------------------
//
// export const ProfileCreateView: React.FC<ProfileCreateProps> = ({ onCreate, onCancel }) => {
//
//   const validationSchema = Yup.object({
//     username: Yup.string()
//       .min(5, 'Username must be at least 5 characters long')
//       .required('Username is required'),
//     name: Yup.string()
//       .required('Full name is required'),
//     bio: Yup.string()
//   });
//
//   const formik = useFormik({
//     initialValues: {
//       username: '',
//       name: '',
//       bio: '',
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       onCreate(values);
//       formik.resetForm();
//     },
//   });
//
//   return (
//     <>
//       <Typography variant="h6" sx={{ pb: 2 }}>
//         Create a New Profile
//       </Typography>
//       <form onSubmit={formik.handleSubmit}>
//         <TextField
//           fullWidth
//           label="Username"
//           variant="outlined"
//           id="username"
//           name="username"
//           value={formik.values.username}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           sx={{ mb: 2 }}
//           error={formik.touched.username && Boolean(formik.errors.username)}
//           helperText={formik.touched.username && formik.errors.username}
//         />
//         <TextField
//           fullWidth
//           label="Full name"
//           variant="outlined"
//           id="name"
//           name="name"
//           value={formik.values.name}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           sx={{ mb: 2 }}
//           error={formik.touched.name && Boolean(formik.errors.name)}
//           helperText={formik.touched.name && formik.errors.name}
//         />
//         <TextField
//           fullWidth
//           label="Bio"
//           variant="outlined"
//           id="bio"
//           name="bio"
//           value={formik.values.bio}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           sx={{ mb: 2 }}
//           error={formik.touched.bio && Boolean(formik.errors.bio)}
//           helperText={formik.touched.bio && formik.errors.bio}
//         />
//         <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
//           <Button variant="outlined" onClick={onCancel} sx={{ width: '45%', py: 1 }}>
//             Cancel
//           </Button>
//           <Button variant="contained" type="submit" sx={{ width: '45%', py: 1 }}>
//             Create Profile
//           </Button>
//         </Box>
//       </form>
//     </>
//   )
// }
// REACT IMPORTS
import React, { useRef } from 'react';

// MUI IMPORTS
import {
  Typography,
  Button,
  TextField,
  Box,
  Input,
} from '@mui/material';

// FORM IMPORTS
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IconCamera } from '@tabler/icons-react';
import { ProfileData } from '../../auth/context/lens/types';

// ----------------------------------------------------------------------

export interface ProfileCreateProps {
  onCreate: (data: ProfileData) => void;
  onCancel: () => void;
}

// ----------------------------------------------------------------------

export const ProfileCreateView: React.FC<ProfileCreateProps> = ({ onCreate, onCancel }) => {
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(5, 'El nombre de usuario debe tener al menos 5 caracteres')
      .required('El nombre de usuario es obligatorio'),
    name: Yup.string().required('El nombre es obligatorio'),
    nickname: Yup.string().required('El apodo es obligatorio'),
    bio: Yup.string(),
    socialLinks: Yup.object({
      web3: Yup.string().url('Ingresa una URL válida'),
      twitter: Yup.string().url('Ingresa una URL válida'),
      facebook: Yup.string().url('Ingresa una URL válida'),
      instagram: Yup.string().url('Ingresa una URL válida'),
    }),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      nickname: '',
      bio: '',
      profileImage: null,
      backgroundImage: null,
      socialLinks: {
        web3: '',
        twitter: '',
        facebook: '',
        instagram: '',
      },
    },
    validationSchema,
    onSubmit: (values) => {
      onCreate(values);
      formik.resetForm();
    },
  });

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      formik.setFieldValue(field, event.currentTarget.files[0]);
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ pb: 2 }}>
        Crear un Nuevo Perfil
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        {/* Subir Imagen de Perfil */}
        <Box display="flex" alignItems="center" mb={2}>
          <Input
            type="file"
            onChange={(event: any) => handleFileChange(event, 'profileImage')}
            inputRef={profileImageInputRef}
            sx={{ display: 'none' }}
          />
          <Button variant="contained" onClick={() => profileImageInputRef.current?.click()}>
            <IconCamera style={{ marginRight: 3 }} />
            Subir Imagen de Perfil
          </Button>
          {formik.values.profileImage && (
            <Typography variant="body2" sx={{ ml: 2 }}>
              Hello profile image name
              {/* {formik.values.profileImage.name ?? 'Hello profile image name'} */}
            </Typography>
          )}
        </Box>

        {/* Subir Imagen de Fondo */}
        <Box display="flex" alignItems="center" mb={2}>
          <Input
            type="file"
            onChange={(event: any) => handleFileChange(event, 'backgroundImage')}
            inputRef={backgroundImageInputRef}
            sx={{ display: 'none' }}
          />
          <Button variant="contained" onClick={() => backgroundImageInputRef.current?.click()}>
            <IconCamera style={{ marginRight: 3 }} />
            Subir Imagen de Fondo
          </Button>
          {formik.values.backgroundImage && (
            <Typography variant="body2" sx={{ ml: 2 }}>
              Hello background image name
              {/* {formik.values.backgroundImage.name ?? 'Hello background image name'} */}
            </Typography>
          )}
        </Box>

        {/* Campos de Texto */}
        <TextField
          fullWidth
          label="Nombre"
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
          label="Apodo"
          variant="outlined"
          id="nickname"
          name="nickname"
          value={formik.values.nickname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={formik.touched.nickname && Boolean(formik.errors.nickname)}
          helperText={formik.touched.nickname && formik.errors.nickname}
        />

        <TextField
          fullWidth
          label="Nombre de Usuario"
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
          label="Biografía"
          variant="outlined"
          id="bio"
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
          rows={4}
          sx={{ mb: 2 }}
          error={formik.touched.bio && Boolean(formik.errors.bio)}
          helperText={formik.touched.bio && formik.errors.bio}
        />

        {/* Enlazar Redes Sociales */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Enlazar Redes Sociales
        </Typography>

        <TextField
          fullWidth
          label="Web3"
          variant="outlined"
          id="socialLinks.web3"
          name="socialLinks.web3"
          value={formik.values.socialLinks.web3}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={formik.touched.socialLinks?.web3 && Boolean(formik.errors.socialLinks?.web3)}
          helperText={formik.touched.socialLinks?.web3 && formik.errors.socialLinks?.web3}
        />

        <TextField
          fullWidth
          label="Twitter"
          variant="outlined"
          id="socialLinks.twitter"
          name="socialLinks.twitter"
          value={formik.values.socialLinks.twitter}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={
            formik.touched.socialLinks?.twitter && Boolean(formik.errors.socialLinks?.twitter)
          }
          helperText={formik.touched.socialLinks?.twitter && formik.errors.socialLinks?.twitter}
        />

        <TextField
          fullWidth
          label="Facebook"
          variant="outlined"
          id="socialLinks.facebook"
          name="socialLinks.facebook"
          value={formik.values.socialLinks.facebook}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={
            formik.touched.socialLinks?.facebook && Boolean(formik.errors.socialLinks?.facebook)
          }
          helperText={formik.touched.socialLinks?.facebook && formik.errors.socialLinks?.facebook}
        />

        <TextField
          fullWidth
          label="Instagram"
          variant="outlined"
          id="socialLinks.instagram"
          name="socialLinks.instagram"
          value={formik.values.socialLinks.instagram}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
          error={
            formik.touched.socialLinks?.instagram &&
            Boolean(formik.errors.socialLinks?.instagram)
          }
          helperText={
            formik.touched.socialLinks?.instagram && formik.errors.socialLinks?.instagram
          }
        />

        {/* Botones de Acción */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={onCancel} sx={{ width: '45%', py: 1 }}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit" sx={{ width: '45%', py: 1 }}>
            Crear Perfil
          </Button>
        </Box>
      </Box>
    </>
  );
};
