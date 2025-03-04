// MUI IMPORTS
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// MOTION IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import { RouterLink } from '@src/routes/components';
import { MotionContainer, varBounce } from '@src/components/animate';
import { PageNotFoundIllustration } from '@src/assets/illustrations';

// ----------------------------------------------------------------------

const Error404View = () => {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sorry, Page Not Found!
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
          sure to check your spelling.
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <PageNotFoundIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to Home
      </Button>
    </MotionContainer>
  );
}

export default Error404View;
