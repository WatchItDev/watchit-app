// @mui
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack, { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

type PostItemSkeletonProps = StackProps & {
  variant?: 'vertical' | 'horizontal';
};

export function PostItemSkeleton({ variant = 'vertical', sx, ...other }: PostItemSkeletonProps) {
  if (variant === 'horizontal') {
    return (
      <Stack
        component={Paper}
        direction="row"
        variant="outlined"
        sx={{
          borderRadius: 2,
          ...sx,
        }}
        {...other}
      >
        <Stack spacing={2} flexGrow={1} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
            <Skeleton sx={{ width: 24, height: 12 }} />
          </Stack>

          <Skeleton sx={{ width: 1, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 40px)`, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 80px)`, height: 10 }} />
        </Stack>

        <Stack sx={{ p: 1 }}>
          <Skeleton sx={{ width: 170, height: 240, flexShrink: 0 }} />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      <Stack sx={{ p: 1 }}>
        <Skeleton sx={{ paddingTop: '100%' }} />
      </Stack>

      <Stack spacing={2} direction="row" alignItems="center" sx={{ p: 3, pt: 2 }}>
        <Skeleton variant="circular" sx={{ width: 40, height: 40, flexShrink: 0 }} />
        <Stack flexGrow={1} spacing={1}>
          <Skeleton sx={{ height: 10 }} />
          <Skeleton sx={{ width: 0.5, height: 10 }} />
        </Stack>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function PostDetailsSkeleton({ ...other }: StackProps) {
  return (
    <Stack {...other}>
      <Skeleton variant="rectangular" sx={{ height: 480 }} />

      <Stack sx={{ width: 1, maxWidth: 720, mx: 'auto' }}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{ my: 8 }}>
          <Skeleton variant="circular" sx={{ width: 64, height: 64, flexShrink: 0 }} />

          <Stack spacing={1} flexGrow={1}>
            <Skeleton height={10} />
            <Skeleton height={10} sx={{ width: 0.9 }} />
            <Skeleton height={10} sx={{ width: 0.8 }} />
          </Stack>
        </Stack>

        <Skeleton sx={{ height: 720 }} />
      </Stack>
    </Stack>
  );
}
