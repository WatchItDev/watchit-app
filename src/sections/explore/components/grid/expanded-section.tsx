import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Tooltip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconChevronDown } from '@tabler/icons-react';
import { GridItem, ExpandedSection as ExpandedSectionType } from '../../types';
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
const OpacityLayer = styled(Box)(() => ({
  width: '100%',
  height: '100%',
}));

const ExpandedSection: React.FC<ExpandedSectionProps> = memo(
  ({ expandedSection, item, onRequestClose, animationDuration, gap, onMeasuredHeight, children }) => {
    void animationDuration;
    const initialHeight = expandedSection.isOpen ? expandedSection.height : 0;
    const contentRef = useRef<HTMLDivElement>(null);
    const [animatedHeight, setAnimatedHeight] = useState(initialHeight);
    const [closeVisible, setCloseVisible] = useState(true);

    const handleControlsVisibility = useCallback((visible: boolean) => {
      setCloseVisible(visible);
    }, []);

    useEffect(() => {
      if (!expandedSection.isOpen) setCloseVisible(true);
    }, [expandedSection.isOpen]);

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

    const enhancedChildren = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<any>, {
          onPlayerControlsVisibilityChange: handleControlsVisibility,
        })
      : children;

    return (
      <AnimatedContainer
        sx={{
          height: expandedSection.isOpen ? targetHeight : 0,
          marginBottom: expandedSection.isOpen ? 0 : gap,
        }}
      >
        <SectionContainer elevation={0}>
          <OpacityLayer
            sx={{
              pointerEvents: expandedSection.isOpen ? 'auto' : 'none',
              opacity: expandedSection.isOpen ? 1 : 0,
            }}
            aria-hidden={expandedSection.isOpen ? undefined : true}
          >
            <SectionContent ref={contentRef}>
              {/* Botón de cierre del expander (opcional, no interfiere con tu contenido) */}
              {closeVisible && (
                <Tooltip title="Close player" placement="bottom">
                  <Button
                    size="small"
                    onClick={onRequestClose}
                    sx={{
                      position: 'absolute',
                      top: 25,
                      left: '50%',
                      padding: '4px 16px',
                      borderRadius: 24,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      color: '#fff',
                      bgcolor: 'rgba(10,12,18,0.75)',
                      border: '1px solid rgba(255,255,255,0.24)',
                      boxShadow: '0 12px 24px rgba(5,6,12,0.45)',
                      '&:hover': { bgcolor: 'rgba(10,12,18,0.92)' },
                    }}
                    aria-label="Close player"
                  >
                    <IconChevronDown size={18} />
                  </Button>
                </Tooltip>
              )}

              {/* Contenido real del expander: player + info (conservado) */}
              {enhancedChildren ?? (
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
