// MUI IMPORTS
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// MOTION IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import { RouterLink } from '@src/routes/components';
import { SeverErrorIllustration } from '@src/assets/illustrations';
import { MotionContainer, varBounce } from '@src/components/animate';

// ----------------------------------------------------------------------

const Error500View = () => {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          500 Internal Server Error
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          There was an error, please try again later.
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to Home
      </Button>
    </MotionContainer>
  );
};

export default Error500View;
