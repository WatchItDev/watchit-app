// REACT IMPORTS
import { FC, PropsWithChildren } from 'react';

// MUI IMPORTS
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------

type CarouselSectionProps = {
  title?: string;
};

export const CarouselSection: FC<PropsWithChildren<CarouselSectionProps>> = ({
  title,
  children,
}) => (
  <Card>
    <CardHeader title={title} sx={{ px: '50px', fontSize: 'clamp(2rem, 1vw, 3rem)' }} />
    <CardContent sx={{ px: '50px', pt: '1rem', pb: '0 !important' }}>{children}</CardContent>
  </Card>
);
