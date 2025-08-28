import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import ProfileHome from '@src/sections/user/components/profile-home';
import { MorePublicationsSectionProps } from '@src/sections/publication/types.ts';

export const PublicationRecommendations: FC<MorePublicationsSectionProps> = (
  props,
) => {
  const { author, publications } = props;

  if (!publications?.length) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 2, width: '100%' }}>
        More from {author}
      </Typography>
      <ProfileHome publications={[...publications]} noPaddings={true} />
    </Box>
  );
};
