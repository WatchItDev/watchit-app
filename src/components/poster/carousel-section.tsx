// REACT IMPORTS
import { FC, PropsWithChildren } from 'react';

// MUI IMPORTS
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------

type CarouselSectionProps = {
  title?: string
};

export const CarouselSection: FC<PropsWithChildren<CarouselSectionProps>> = ({ title, children }) => (
    <Card>
      <CardHeader title={title} sx={{ px: '25px'}} />
      <CardContent sx={{ px: '25px' }}>
        { children }
      </CardContent>
    </Card>
)
