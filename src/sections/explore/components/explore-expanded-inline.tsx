import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import type { Post } from '@src/graphql/generated/graphql';
import ExpanderPlayerInfo from '@src/sections/explore/components/explore-expander-info';

type Props = {
  top: number;
  width?: number;
  open: boolean;
  animationMs: number;
  onMeasured: (h: number) => void;
  post?: Post;
};

export default function ExploreExpandedInline({
                                                top,
                                                open,
                                                animationMs,
                                                onMeasured,
                                                post,
                                              }: Props) {
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
        {post ? <ExpanderPlayerInfo post={post} /> : null}
      </Box>
    </Box>
  );
}
