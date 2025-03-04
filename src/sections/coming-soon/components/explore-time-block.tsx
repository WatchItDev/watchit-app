// MUI IMPORTS
import Box from '@mui/material/Box';

// LOCAL IMPORTS
import { TimeBlockProps } from '@src/sections/coming-soon/types.ts';

// ----------------------------------------------------------------------

export const TimeBlock = ({ label, value }: TimeBlockProps) => {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}
