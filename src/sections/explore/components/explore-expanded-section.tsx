import React, { memo, useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridItem, ExpandedSection as ExpandedSectionType } from '../types';
import { CloseIcon } from 'yet-another-react-lightbox';
import { useDispatch } from 'react-redux';
import { updateExpandedHeight } from '@redux/grid';

interface ExpandedSectionProps {
  expandedSection: ExpandedSectionType;
  item: GridItem;
  onRequestClose: () => void;
  onAfterClose?: () => void;
  animationDuration: number;
}

const FADE_MS = 180;

const SectionContainer = styled(Paper)(({}) => ({
  position: 'relative',
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  margin: 0,
  backgroundColor: 'transparent',
  boxShadow: 'none', // sin sombra al abrir
}));

const SectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

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

const ItemPreview = styled(Box)<{ itemColor: string }>(({ theme, itemColor }) => ({
  width: 60,
  height: 60,
  borderRadius: 12,
  backgroundColor: itemColor,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.2rem',
}));

const ExpandedSection: React.FC<ExpandedSectionProps> = memo(
  ({ expandedSection, item, onRequestClose, onAfterClose, animationDuration }) => {
    const dispatch = useDispatch();
    const containerRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const closeAfterTimerRef = useRef<number | null>(null);
    const onAfterCloseRef = useRef<typeof onAfterClose>(() => {});

    useEffect(() => {
      onAfterCloseRef.current = onAfterClose;
    }, [onAfterClose]);

    // ---- Height measurement (so the grid reserves space/offset) ----
    useEffect(() => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const h = Math.ceil(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight);
        if (h >= 0) dispatch(updateExpandedHeight(h));
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [dispatch]);

    // ---- FADE ----
    useEffect(() => {
      setShow(false);

      if (expandedSection.isOpen) {
        const id = window.setTimeout(() => setShow(true), animationDuration);
        return () => clearTimeout(id);
      } else {
        setShow(false);
        if (closeAfterTimerRef.current) clearTimeout(closeAfterTimerRef.current);
        closeAfterTimerRef.current = window.setTimeout(() => {
          onAfterCloseRef.current?.();
          closeAfterTimerRef.current = null;
        }, animationDuration);
      }
    }, [expandedSection.isOpen, animationDuration]);

    useEffect(() => {
      return () => {
        if (closeAfterTimerRef.current) clearTimeout(closeAfterTimerRef.current);
      };
    }, []);

    const handleCloseClick = () => {
      onRequestClose();
    };

    const renderDefaultContent = () => (
      <SectionContent>
        <ItemPreview itemColor={item.color}>
          {item.title.charAt(0).toUpperCase()}
        </ItemPreview>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {item.title}
        </Typography>
        {item.description && (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" align="center">
          ID: {item.id} | Dimensiones: {item.dimensions.width}×{item.dimensions.height}
        </Typography>
        <IconButton
          size="small"
          onClick={handleCloseClick}
          sx={{ color: 'white' }}
          aria-label="Cerrar sección"
        >
          <CloseIcon />
        </IconButton>
      </SectionContent>
    );

    return (
      <SectionContainer ref={containerRef} elevation={0}>
        <OpacityLayer $show={show} $delayMs={expandedSection.isOpen ? animationDuration : 0}>
          <Box>
            {renderDefaultContent()}
          </Box>
        </OpacityLayer>
      </SectionContainer>
    );
  }
);

ExpandedSection.displayName = 'ExpandedSection';
export default ExpandedSection;
