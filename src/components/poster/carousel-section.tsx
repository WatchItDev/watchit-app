// REACT IMPORTS
import React, { FC, PropsWithChildren } from 'react';

// MUI IMPORTS
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------

type CarouselSectionProps = {
  action?: React.ReactNode,
  title?: string
};

export const CarouselSection: FC<PropsWithChildren<CarouselSectionProps>> = ({ title, action, children }) => (
    <Card>
      <CardHeader title={title} sx={{ px: '25px'}} action={action} />
      <CardContent sx={{ px: '25px' }}>
        { children }
      </CardContent>
    </Card>
)
