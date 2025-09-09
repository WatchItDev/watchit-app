import React from 'react';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { icons } from '@tabler/icons-react';
import { WidgetSurface } from '../styles';
import QuickControls from './quick-controls.tsx';

export default function WidgetPanel({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Portal>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'fixed', right: { xs: 8, sm: 16 }, bottom: { xs: 8, sm: 16 }, zIndex: 1400, width: { xs: 'calc(100vw - 16px)', sm: 360, md: 380 } }}>
          <WidgetSurface elevation={12}>
            {/* corner glows */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,140,0,0.28), rgba(255,140,0,0) 70%)', filter: 'blur(16px)' }} />
              <div style={{ position: 'absolute', right: -60, bottom: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,220,140,0.22), rgba(0,220,140,0) 70%)', filter: 'blur(16px)' }} />
            </div>

            {/* Flexible height: grows with content up to a max, scroll contained */}
            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: { xs: '76vh', sm: 560 } }} onWheel={(e) => e.stopPropagation()}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.25, py: 1, borderBottom: (t) => `1px solid rgba(255,255,255,${t.palette.mode === 'dark' ? 0.06 : 0.1})` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                  <Tooltip title="Watchit AI — helps you find the right content for your vibe">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <icons.IconSparkles size={18} />
                      <Typography variant="subtitle2" fontWeight={700}>Watchit AI</Typography>
                    </Stack>
                  </Tooltip>
                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, opacity: 0.24 }} />
                  <QuickControls />
                </Stack>
                <Tooltip title="Close">
                  <IconButton size="small" onClick={onClose}><icons.IconX size={16} /></IconButton>
                </Tooltip>
              </Box>

              {/* Body */}
              <Box sx={{ p: 1.25, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                {children}
              </Box>

              {/* Footer */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.25, py: 1, borderTop: (t) => `1px solid rgba(255,255,255,${t.palette.mode === 'dark' ? 0.06 : 0.1})` }}>
                <Typography variant="caption" color="text.secondary">Learns from your likes to suggest better picks.</Typography>
                <Tooltip title="About">
                  <IconButton size="small"><icons.IconInfoCircle size={16} /></IconButton>
                </Tooltip>
              </Box>
            </Box>
          </WidgetSurface>
        </Box>
      </Slide>
    </Portal>
  );
}
