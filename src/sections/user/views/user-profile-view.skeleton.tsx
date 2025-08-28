import React from 'react';
import {
  Box,
  Container,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useSettingsContext } from '@src/components/settings';

export const UserProfileViewSkeleton: React.FC = () => {
  const settings = useSettingsContext();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{ overflowX: 'hidden', pb: 6, pt: 2 }}
    >
      {/* ------------- COVER (banner) ------------- */}
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: { xs: 200, sm: 240, md: 300 },
          borderRadius: 1,
        }}
      />

      {/* ------------- AVATAR + ACTIONS ------------- */}
      <Box
        sx={{
          position: 'relative',
          mt: { xs: -6, sm: -8 },
          px: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Avatar */}
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: 96, sm: 140 },
            height: { xs: 96, sm: 140 },
            borderRadius: 1,
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>

      {/* ------------- MAIN INFO ------------- */}
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Left column */}
        <Box sx={{ flex: 1, pl: 4 }}>
          <Skeleton variant="rectangular" width="40%" height={26} />
          <Skeleton
            variant="rectangular"
            width="30%"
            height={20}
            sx={{ mt: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width="60%"
            height={16}
            sx={{ mt: 1.5 }}
          />

          {/* Follow / Play buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Skeleton
              variant="rectangular"
              width={100}
              height={40}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={40}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </Box>

        {/* Right column (address card) */}
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: '100%', md: 260 },
            height: { xs: 160, md: 160 },
            borderRadius: 2,
            mt: { xs: 4, sm: -8 },
          }}
        />
      </Box>

      {/* ------------- TABS ------------- */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={220}
          height={36}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      {/* ------------- PANEL (publications / followers / etc.) ------------- */}
      <Box sx={{ mt: 2 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={mdUp ? 320 : 260}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Container>
  );
};
