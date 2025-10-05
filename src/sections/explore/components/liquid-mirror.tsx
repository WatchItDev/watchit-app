import { Box, BoxProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

type Props = BoxProps & { disableBackdrop?: boolean };

const Styled = styled(Box, {
  shouldForwardProp: (p) => p !== 'disableBackdrop',
})<Props>(({ theme, disableBackdrop }) => {
  const dark = theme.palette.mode === 'dark';
  const tint = dark ? alpha('#0e1319', 0.36) : alpha('#f7f9ff', 0.34);

  const common = {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    isolation: 'isolate',
    color: dark ? 'rgba(249,250,255,0.96)' : 'rgba(10,12,20,0.92)',
    background: tint,
    border: '1px solid rgba(255,255,255,0.22)',
    boxShadow:
      '0 40px 80px rgba(8,12,26,0.55), inset 0 1px 0 rgba(255,255,255,0.22)',
    '::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      pointerEvents: 'none',
      background:
        'radial-gradient(120% 60% at 0% 0%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0) 55%)',
      mixBlendMode: 'screen',
      opacity: dark ? 0.28 : 0.35,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      pointerEvents: 'none',
      boxShadow:
        'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 18px 28px rgba(10,12,18,0.35), inset 0 -12px 22px rgba(8,10,24,0.28)',
    },
  } as const;

  if (disableBackdrop) {
    // Lo usaremos cuando dibujamos el video espejado dentro del panel (Chrome/Firefox)
    return {
      ...common,
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    };
  }

  // Fallback con blur; y en Safari añadimos el filtro líquido de verdad
  return {
    ...common,
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    '@supports (backdrop-filter: blur(2px) url("#x"))': {
      backdropFilter: 'url(#liquid-backdrop) blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'url(#liquid-backdrop) blur(24px) saturate(180%)',
    },
  };
});

export default function GlassPanel({ disableBackdrop, ...rest }: Props) {
  return <Styled disableBackdrop={disableBackdrop} {...rest} />;
}
