import React, { memo, useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridItem, ExpandedSection as ExpandedSectionType } from '../../types';
import { CloseIcon } from 'yet-another-react-lightbox';
import { GRID_CONFIG } from '../../CONSTANTS';

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

const AnimatedContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
}));

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
const OpacityLayer = styled('div')<{
  $show: boolean;
  $delayMs: number;
}>(({ $show, $delayMs }) => ({
  opacity: $show ? 1 : 0,
  transitionProperty: 'opacity',
  transitionDuration: `${FADE_MS}ms`,
  transitionTimingFunction: 'ease',
  transitionDelay: $show ? `${$delayMs}ms` : '0ms',
  pointerEvents: $show ? 'auto' : 'none',
}));

const ExpandedSection: React.FC<ExpandedSectionProps> = memo(
  ({ expandedSection, item, onRequestClose, animationDuration, gap, onMeasuredHeight, children }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const [animatedHeight, setAnimatedHeight] = useState(0);

    // ---- MEDICIÓN DE ALTURA (throttled con rAF para evitar warnings del ResizeObserver) ----
    const lastH = useRef<number>(-1);
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
        if (lastH.current > 0) requestAnimationFrame(() => setAnimatedHeight(lastH.current));
      } else {
        requestAnimationFrame(() => setAnimatedHeight(0));
      }
    }, [expandedSection.isOpen]);

    // ---- ORQUESTACIÓN DEL FADE (sin Collapse) ----
    useEffect(() => {
      setShow(false);
      if (expandedSection.isOpen) {
        const id = window.setTimeout(() => setShow(true), animationDuration);
        return () => window.clearTimeout(id);
      } else {
        setShow(false);
      }
    }, [expandedSection.isOpen, animationDuration]);

    return (
      <AnimatedContainer
        sx={{
          height: `${Math.max(animatedHeight, 0)}px`,
          marginBottom: expandedSection.isOpen ? 0 : `${GRID_CONFIG.gap}px`,
          transition: `height ${animationDuration}ms ease, margin-bottom ${animationDuration}ms ease`,
        }}
      >
        <SectionContainer elevation={0}>
          <OpacityLayer $show={show} $delayMs={expandedSection.isOpen ? animationDuration : 0}>
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
      </AnimatedContainer>
    );
  }
);

ExpandedSection.displayName = 'ExpandedSection';
export default ExpandedSection;
