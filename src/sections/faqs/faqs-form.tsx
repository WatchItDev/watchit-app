import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
//
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function FaqsForm() {
  return (
    <Stack component={MotionViewport} spacing={3}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h4">{`Haven't found the right help?`}</Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Name" />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Email" />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Subject" />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Enter your message here." multiline rows={4} />
      </m.div>

      <m.div variants={varFade().inUp}>
        <Button size="large" variant="contained">
          Submit Now
        </Button>
      </m.div>
    </Stack>
  );
}
