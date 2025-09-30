import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Fab, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconInfoCircle, IconX } from '@tabler/icons-react';
import PublicationPlayer from '@src/sections/publication/components/publication-player';
import PublicationDetailMain from '@src/components/publication-detail-main';
import type { Post } from '@src/graphql/generated/graphql';

export default function ExpanderPlayerInfo({ post }: { post: Post }) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [infoOpen, setInfoOpen] = useState(mdUp);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [playerH, setPlayerH] = useState<number>(0);

  useLayoutEffect(() => {
    const el = playerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const h = e.contentRect.height;
        if (Number.isFinite(h)) setPlayerH(h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setInfoOpen(mdUp);
  }, [mdUp]);

  const MIN_H_XS = 280;
  const MIN_H_MD = 360;

  return (
    <Box sx={{ position: 'relative', marginBottom: '12px !important' }}>
      <Box
        sx={{
          display: 'grid',
          // gridTemplateColumns: infoOpen && mdUp ? 'minmax(0,1fr) 400px' : 'minmax(0,1fr)',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: 2,
          alignItems: 'start',
        }}
      >
        {/* PLAYER */}
        <Box ref={playerRef} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', aspectRatio: '16 / 9', minHeight: { xs: MIN_H_XS, md: MIN_H_MD }, border: '1px solid rgba(255,255,255,0.08)' }}>
          <PublicationPlayer publication={post} loading={false} />
        </Box>

        {/* INFO DERECHA (colapsable) */}
        {/* {infoOpen && ( */}
          {/* <Box sx={{ position: 'relative', maxHeight: playerH || { xs: MIN_H_XS, md: MIN_H_MD }, overflowY: 'auto', borderRadius: 2 }}>
            <IconButton
              onClick={() => setInfoOpen(false)}
              size="small"
              sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2, bgcolor: 'rgba(0,0,0,0.4)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
            >
              <IconX size={16} />
            </IconButton>

            <PublicationDetailMain post={post} mode="inline" />
          </Box> */}
        {/* )} */}
      </Box>

      {/* flotante para abrir cuando está colapsado */}
      {/* {!infoOpen && (
        <Tooltip title="Mostrar información" placement="left">
          <Fab size="medium" onClick={() => setInfoOpen(true)} sx={{ position: 'absolute', top: 12, right: 12 }}>
            <IconInfoCircle />
          </Fab>
        </Tooltip>
      )} */}
    </Box>
  );
}
