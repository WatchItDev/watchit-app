import { Box, BoxProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { forwardRef, useEffect, useState } from 'react';
import type { MotionProps } from 'framer-motion';

const StyledGlass = styled(Box, {
  shouldForwardProp: (p) => p !== 'hasBackdropUrl',
})<{ hasBackdropUrl?: boolean }>(({ theme, hasBackdropUrl }) => {
  const dark = theme.palette.mode === 'dark';

  // Tinte base (MUY bajo para que se lea el fondo)
  const tint = dark ? alpha('#0e1319', 0.36) : alpha('#f7f9ff', 0.34);
  const borderLight = dark ? 'rgba(255,255,255,0.24)' : 'rgba(20,22,28,0.18)';

  // Base frosted universal
  let backdrop = 'blur(24px) saturate(180%)';
  // Safari: agrega refracción “líquida”
  if (hasBackdropUrl) backdrop += ' url(#watchit-liquid)';

  return {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    isolation: 'isolate',                // evita artefactos de mezcla
    background: tint,
    color: dark ? 'rgba(249,250,255,0.96)' : 'rgba(10,12,20,0.92)',

    backdropFilter: backdrop,
    WebkitBackdropFilter: backdrop,

    boxShadow:
      '0 40px 80px rgba(8,12,26,0.55), 0 1px 0 rgba(255,255,255,0.22) inset',
    border: `1px solid ${borderLight}`,
    willChange: 'transform, opacity, backdrop-filter',

    // Highlight “especular” (gloss)
    '::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      pointerEvents: 'none',
      background:
        'radial-gradient(120% 60% at 0% 0%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.0) 55%)',
      mixBlendMode: 'screen',
      opacity: dark ? 0.28 : 0.35,
    },

    // Sombra interna suave para dar espesor
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      pointerEvents: 'none',
      boxShadow:
        'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 18px 28px rgba(10,12,18,0.35), inset 0 -12px 22px rgba(8,10,24,0.28)',
    },
  };
});

export function detectBackdropUrl(): boolean {
  // Safari devuelve true; Chromium/Firefox suelen devolver false.
  try {
    return (
      CSS.supports('backdrop-filter', 'blur(1px) url(#x)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px) url(#x)')
    );
  } catch {
    return false;
  }
}

export type GlassPanelProps = BoxProps & MotionProps;

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>((props, ref) => {
  const [has, setHas] = useState(false);
  useEffect(() => setHas(detectBackdropUrl()), []);
  return <StyledGlass ref={ref} hasBackdropUrl={has} data-has-backdrop={has ? 'true' : 'false'} {...props} />;
});

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
