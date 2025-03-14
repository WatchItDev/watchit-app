import { Box, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { varFade } from '@src/components/animate';

export function PublicationSponsorsAndBackers() {
  const variants = varFade().inRight;

  return (
    <>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mt: 4 }}
      >
        <m.div variants={variants}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
            gutterBottom
          >
            Sponsors
          </Typography>
        </m.div>
        <Box sx={{ mt: 2, opacity: 0.8 }}>
          <m.div variants={variants}>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ lineHeight: 1.1, mb: 0.5, width: '100%' }}
              gutterBottom
            >
              No sponsors yet. Be the first to join and support!
            </Typography>
          </m.div>
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mt: 4 }}
      >
        <m.div variants={variants}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
            gutterBottom
          >
            Backers
          </Typography>
        </m.div>
        <Box sx={{ mt: 2, opacity: 0.8 }}>
          <m.div variants={variants}>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ lineHeight: 1.1, mb: 0.5, width: '100%' }}
              gutterBottom
            >
              No backers yet. Be the first to join and support!
            </Typography>
          </m.div>
        </Box>
      </Box>
    </>
  );
}
