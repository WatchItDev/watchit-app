// MUI IMPORTS
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// MOTION IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import { RouterLink } from '@src/routes/components';
import { ForbiddenIllustration } from '@src/assets/illustrations';
import { MotionContainer, varBounce } from '@src/components/animate';

// ----------------------------------------------------------------------

const Error403View = () => {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          No permission
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          The page you&apos;re trying access has restricted access.
          <br />
          Please refer to your system administrator
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to Home
      </Button>
    </MotionContainer>
  );
};

export default Error403View;
