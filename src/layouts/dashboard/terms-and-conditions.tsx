import { FC } from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

const TermsAndConditions: FC = () => (
  <Typography variant="caption" sx={{ textAlign: 'center', mt: 4 }}>
    <Link
      href={GLOBAL_CONSTANTS.TERMS_AND_CONDITIONS}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      color="text.secondary"
    >
      Terms &amp; Conditions
    </Link>
  </Typography>
);

export default TermsAndConditions;
