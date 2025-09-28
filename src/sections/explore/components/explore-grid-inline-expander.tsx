import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import ExploreGridMediaPanel from '@src/sections/explore/components/explore-grid-media-panel';
import type { ExploreGridInlineExpanderProps } from '@src/sections/explore/types';

/**
 * Inline expansion area that hosts the detailed card when a grid item opens.
 */
export default function ExploreGridInlineExpander({
  top,
  open,
  animationMs,
  onMeasured,
  post,
}: ExploreGridInlineExpanderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = Math.ceil(entry.contentRect.height);
      if (Number.isFinite(h)) onMeasured(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onMeasured]);

  return (
    <Box sx={{ position: 'absolute', left: 16, right: 16, top, zIndex: 1000, pointerEvents: 'auto' }}>
      <Box
        ref={containerRef}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          background: 'transparent',
          boxShadow: 'none',
          opacity: open ? 1 : 0,
          transition: `opacity ${animationMs}ms ease`,
        }}
      >
        {post ? <ExploreGridMediaPanel post={post} /> : null}
      </Box>
    </Box>
  );
}
