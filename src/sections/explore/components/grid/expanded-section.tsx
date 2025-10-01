import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridItem, ExpandedSection as ExpandedSectionType } from '../../types';
import { CloseIcon } from 'yet-another-react-lightbox';
import { GRID_CONFIG } from '../../CONSTANTS';
import { motion } from 'framer-motion';

interface ExpandedSectionProps {
  expandedSection: ExpandedSectionType;
  item: GridItem;
  onRequestClose: () => void;     // pone isOpen=false
  animationDuration: number;      // duración del movimiento del grid (top/left)
  gap: number;

  /** Reporta altura medida al padre (para centrar) */
  onMeasuredHeight?: (h: number) => void;

  /** Contenido real del expander (player + info) */
  children?: React.ReactNode;
}

/** Fade rápido para el contenido. */
const FADE_MS = 180;
const CONTENT_VARIANTS = {
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  hide: { opacity: 0, y: 24, scale: 0.97, filter: 'blur(12px)' },
} as const;

const AnimatedContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
}));

const MotionAnimatedContainer = motion(AnimatedContainer);

const SectionContainer = styled(Paper)(() => ({
  position: 'relative',
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  margin: 0,
  backgroundColor: 'transparent',
  boxShadow: 'none',
}));

const SectionContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: `0 ${GRID_CONFIG.gap}px`,
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
}));

/** Capa que controla el fade de TODO (header + contenido). */
const OpacityLayer = styled(motion.div)(() => ({
  width: '100%',
  height: '100%',
}));

const ExpandedSection: React.FC<ExpandedSectionProps> = memo(
  ({ expandedSection, item, onRequestClose, animationDuration, gap, onMeasuredHeight, children }) => {
    const initialHeight = expandedSection.isOpen ? expandedSection.height : 0;
    const contentRef = useRef<HTMLDivElement>(null);
    const [animatedHeight, setAnimatedHeight] = useState(initialHeight);

    // ---- MEDICIÓN DE ALTURA (throttled con rAF para evitar warnings del ResizeObserver) ----
    const lastH = useRef<number>(
      Number.isFinite(initialHeight) && initialHeight > 0 ? initialHeight : -1
    );
    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (!rect) return;
        const h = Math.ceil(rect.height);
        if (h !== lastH.current) {
          lastH.current = h;
          requestAnimationFrame(() => {
            onMeasuredHeight?.(h);
            if (expandedSection.isOpen) setAnimatedHeight(h);
          });
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [onMeasuredHeight, expandedSection.isOpen]);

    useEffect(() => {
      if (expandedSection.isOpen) {
        const nextH = expandedSection.height > 0 ? expandedSection.height : lastH.current;
        if (Number.isFinite(nextH) && nextH >= 0) {
          requestAnimationFrame(() => setAnimatedHeight(Math.max(nextH, 0)));
        }
      } else {
        lastH.current = 0;
        requestAnimationFrame(() => setAnimatedHeight(0));
      }
    }, [expandedSection.isOpen, expandedSection.height]);

    const targetHeight = Math.max(animatedHeight, 0);
    const containerTransition = useMemo(
      () => ({
        height: { type: 'spring', stiffness: 180, damping: 28, mass: 0.8 },
        marginBottom: { duration: animationDuration / 1000, ease: [0.22, 1, 0.36, 1] as const },
      }),
      [animationDuration]
    );

    return (
      <MotionAnimatedContainer
        initial={false}
        animate={{
          height: expandedSection.isOpen ? targetHeight : 0,
          marginBottom: expandedSection.isOpen ? 0 : gap,
        }}
        transition={containerTransition}
        style={{ willChange: 'height, margin-bottom' }}
      >
        <SectionContainer elevation={0}>
          <OpacityLayer
            initial={false}
            animate={expandedSection.isOpen ? 'show' : 'hide'}
            variants={CONTENT_VARIANTS}
            transition={{
              duration: FADE_MS / 1000,
              ease: [0.16, 1, 0.3, 1] as const,
              delay: 0,
            }}
            style={{
              pointerEvents: expandedSection.isOpen ? 'auto' : 'none',
              transformOrigin: 'top center',
            }}
          >
            <SectionContent ref={contentRef}>
              {/* Botón de cierre del expander (opcional, no interfiere con tu contenido) */}
              <IconButton
                size="small"
                onClick={onRequestClose}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.35)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' },
                }}
                aria-label="Cerrar sección"
              >
                <CloseIcon />
              </IconButton>

              {/* Contenido real del expander: player + info (conservado) */}
              {children ?? (
                <>
                  {/* Fallback mínimo por si llega vacío */}
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>{item.title}</Typography>
                  {item.description && (
                    <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.7 }}>
                      {item.description}
                    </Typography>
                  )}
                </>
              )}
            </SectionContent>
          </OpacityLayer>
        </SectionContainer>
      </MotionAnimatedContainer>
    );
  }
);

ExpandedSection.displayName = 'ExpandedSection';
export default ExpandedSection;
