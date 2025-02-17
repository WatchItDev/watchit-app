// REACT IMPORTS
import { FC, PropsWithChildren } from 'react';

// MUI IMPORTS
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------

export const CarouselSection: FC<PropsWithChildren> = ({
  children,
}) => (
  <Card>
    <CardContent sx={{ px: '50px', pt: '1rem', pb: '0 !important' }}>{children}</CardContent>
  </Card>
);
