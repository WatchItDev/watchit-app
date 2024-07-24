import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ReactHookForm from './react-hook-form';

// ----------------------------------------------------------------------

export default function FormValidationView() {
  const [debug, setDebug] = useState(true);

  const handleChangeDebug = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebug(event.target.checked);
  };

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Form Validation"
            links={[{ name: 'Components', href: paths.components }, { name: 'Form Validation' }]}
            moreLink={['https://react-hook-form.com/', 'https://github.com/jquense/yup']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4"> React Hook Form + Yup </Typography>
          <FormControlLabel
            control={<Switch checked={debug} onChange={handleChangeDebug} />}
            label="Show Debug"
            labelPlacement="start"
          />
        </Stack>

        <Divider sx={{ my: 5 }} />

        <ReactHookForm debug={debug} />
      </Container>
    </>
  );
}
