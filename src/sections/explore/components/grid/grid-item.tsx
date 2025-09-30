import React, { memo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridItem as GridItemType } from '../../types';
import { calculateItemPosition } from '@src/utils/grid';

interface GridItemProps {
    item: GridItemType;
    gridDimensions: any;
    rowHeights: number[];
    isExpanded: boolean;
    isDimmed: boolean;
    onItemClick: (item: GridItemType) => void;
    onCloseExpanded: () => void; // compat
    expandedContent?: React.ReactNode;
    animationDuration: number;

    /** fila por encima de la cual se inserta la sección expandida */
    anchorRowForOffset: number | null;
    /** desplazamiento vertical (px) que se aplica a filas >= anchorRow */
    expandedOffset: number;

    /** 🔑 desactiva transiciones en el primer paint para evitar la “cascada” top-down */
    transitionsEnabled?: boolean;
}

const StyledGridItem = styled(Box, {
    shouldForwardProp: (prop) =>
        prop !== 'isExpanded' &&
        prop !== 'isDimmed' &&
        prop !== 'animationDuration' &&
        prop !== 'transitionsEnabled',
})<{
    isExpanded: boolean;
    isDimmed: boolean;
    animationDuration: number;
    transitionsEnabled?: boolean;
}>(({ isExpanded, isDimmed, animationDuration, transitionsEnabled }) => ({
    position: 'absolute',
    borderRadius: 12,
    cursor: 'pointer',
    // Solo transicionamos lo que realmente cambia; en el primer render => SIN transición
    transition: transitionsEnabled
        ? `top ${animationDuration}ms cubic-bezier(0.4,0,0.2,1),
       left ${animationDuration}ms cubic-bezier(0.4,0,0.2,1),
       transform ${animationDuration}ms cubic-bezier(0.4,0,0.2,1),
       box-shadow ${animationDuration}ms cubic-bezier(0.4,0,0.2,1),
       opacity ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)`
        : 'none',
    opacity: isDimmed ? 0.3 : 1,
    transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isExpanded
        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
        : '0 4px 16px rgba(0, 0, 0, 0.1)',
    zIndex: isExpanded ? 1000 : 1,
    '&:hover': {
        transform: isExpanded ? 'scale(1.02)' : 'scale(1.05)',
        boxShadow: isExpanded
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 6px 24px rgba(0, 0, 0, 0.15)',
        zIndex: 10,
    },
    '&:active': {
        transform: isExpanded ? 'scale(1.02)' : 'scale(0.98)',
    },
    // Pistas para el navegador (mejora micro-stutters)
    willChange: 'top, left, transform',
    contain: 'layout paint style',
}));

const ItemContent = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background:
            'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        borderRadius: 'inherit',
    },
}));

const GridItem: React.FC<GridItemProps> = memo(
    ({
         item,
         gridDimensions,
         rowHeights,
         isExpanded,
         isDimmed,
         onItemClick,
         // onCloseExpanded,
         expandedContent,
         animationDuration,
         anchorRowForOffset,
         expandedOffset,
         transitionsEnabled = true,
     }) => {
        const handleClick = useCallback(() => {
            onItemClick(item);
        }, [item, onItemClick]);

        const base = calculateItemPosition(item, gridDimensions, rowHeights);

        const needsOffset =
            anchorRowForOffset !== null && item.position.y >= anchorRowForOffset;
        const y = needsOffset ? base.y + expandedOffset : base.y;

        const itemWidth =
            item.dimensions.width * gridDimensions.itemSize +
            (item.dimensions.width - 1) * gridDimensions.gap;
        const itemHeight =
            item.dimensions.height * gridDimensions.itemSize +
            (item.dimensions.height - 1) * gridDimensions.gap;

        return (
            <StyledGridItem
                isExpanded={isExpanded}
                isDimmed={isDimmed}
                animationDuration={animationDuration}
                transitionsEnabled={transitionsEnabled}
                style={{
                    left: base.x,
                    top: y,
                    width: itemWidth,
                    height: itemHeight,
                    backgroundColor: item.color,
                }}
                onClick={handleClick}
            >
                <ItemContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {item.title}
                    </Typography>
                    {item.description && (
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {item.description}
                        </Typography>
                    )}
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            opacity: 0.7,
                            fontSize: '0.7rem',
                        }}
                    >
                        {item.dimensions.width}×{item.dimensions.height}
                    </Typography>
                </ItemContent>
            </StyledGridItem>
        );
    }
);

GridItem.displayName = 'GridItem';
export default GridItem;
