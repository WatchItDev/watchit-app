import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';

interface SkeletonGridProps {
  columns: number;
  itemSize: number;
  gap: number;
}

/**
 * Lightweight shimmering placeholder rendered while the grid data is loading.
 */
export function SkeletonGrid({ columns, itemSize, gap }: SkeletonGridProps) {
  const theme = useTheme();
  const count = Math.max(columns * 6, 1);
  const cardBorder = alpha(theme.palette.common.white, 0.06);
  const chipBg = alpha(theme.palette.common.white, 0.08);

  return (
    <Box sx={{ position: 'absolute', left: gap, right: gap, top: gap }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, ${itemSize}px)`,
          gridAutoRows: `${itemSize}px`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${cardBorder}`,
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                position: 'absolute',
                inset: 0,
                height: '100%',
                bgcolor: alpha(theme.palette.common.white, 0.05),
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <Skeleton variant="rounded" width={56} height={18} sx={{ bgcolor: chipBg }} />
              <Skeleton variant="rounded" width={56} height={18} sx={{ bgcolor: chipBg, flexShrink: 0 }} />
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
