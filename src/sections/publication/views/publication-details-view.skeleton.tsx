import React from 'react';
import { Box, Skeleton, useTheme, useMediaQuery } from '@mui/material';

export const PublicationDetailViewSkeleton: React.FC = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('lg'));
  const rootId = React.useId();
  const lines = ['100%', '100%', '85%'];

  return (
    <Box sx={{ width: '100%', p: 3}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        <Box sx={{ position: 'relative', flex: 1, borderRadius: 2, maxWidth: mdUp ? 'calc(100% - 470px)' : '100%' }}>
          <Skeleton variant="rectangular" sx={{ width: '100%', height: { xs: 200, sm: 260, md: 320 }, borderRadius: 1 }} />

          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              left: 24,
              top: { xs: 140, sm: 200, md: 260 },
              width: 120,
              height: 38,
              borderRadius: 1,
              opacity: 0.5,
            }}
          />

          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              top: { xs: '100px', sm: '130px', md: '160px' },
              left: '50%',
              width: { xs: 130, sm: 160, md: 200 },
              height: { xs: 130, sm: 160, md: 200 },
              borderRadius: 1,
              transform: 'translate(-50%, -50%)',
              opacity: 0.6,
            }}
          />

          <Box sx={{ mt: 4 }}>
            <Skeleton variant="rectangular" width="30%" height={34} />
            {lines.map((w, i) => (
              <Skeleton
                key={`${rootId}-line-${i}`}
                variant="rectangular"
                width={w}
                height={18}
                sx={{ mt: 1 + +(i === 0) }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 6 }}>
            <Skeleton variant="rectangular" width={150} height={26} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2, borderRadius: 1 }} />
          </Box>

          <Box sx={{ mt: 6 }}>
            <Skeleton variant="rectangular" width={110} height={26} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2, borderRadius: 1 }} />
          </Box>
        </Box>

        {mdUp && (
          <Skeleton
            variant="rectangular"
            sx={{
              width: {
                xs: '100%',
                lg: '450px',
              },
              height: 420,
              borderRadius: 2
            }}
          />
        )}
      </Box>
    </Box>
  );
};
