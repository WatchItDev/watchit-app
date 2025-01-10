import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import { ProfilePublicationItem } from './profile-publication-item';
import { useSelector } from 'react-redux';
import { AnyPublication } from '@lens-protocol/api-bindings';

interface ProfileHomeProps {
  publications?: AnyPublication[]; // Array of publications
  noPaddings?: boolean; // Flag to remove container paddings
  minItemWidth?: number; // Min width per item
  maxItemWidth?: number; // Max width per item
  initialRows?: number; // Rows to show initially
  rowsIncrement?: number; // Rows to add each time "Show more" is clicked
  maxHeight?: string | number; // Max height for the parent container (e.g. '29rem', 400, etc.)
  scrollable?: boolean; // Whether the container is allowed to scroll or not
  scrollOnShowMore?: boolean; // Scroll down when user clicks "Show more"
}

export default function ProfileHome({
  publications = [],
  minItemWidth = 150,
  maxItemWidth = 250,
  initialRows = 2,
  rowsIncrement = 2,
  maxHeight = '31rem',
  scrollable = true,
  scrollOnShowMore = true,
}: ProfileHomeProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const minibarState = useSelector((state: any) => state.minibar.state);

  // Number of items to display per row
  const [itemsPerRow, setItemsPerRow] = useState<number>(1);
  // Current number of rows to display
  const [rowsToShow, setRowsToShow] = useState<number>(initialRows);

  /**
   * Calculates how many items can fit in a single row based on
   * container width + minItemWidth / maxItemWidth constraints.
   */
  const calculateItemsPerRow = (parentWidth: number): number => {
    const maxPossibleItems = Math.floor(parentWidth / minItemWidth);
    const minPossibleItems = Math.floor(parentWidth / maxItemWidth);

    for (let items = maxPossibleItems; items >= minPossibleItems; items--) {
      const itemWidth = parentWidth / items;
      if (itemWidth >= minItemWidth && itemWidth <= maxItemWidth) {
        return items;
      }
    }
    return 1; // Fallback
  };

  /**
   * Automatically update 'itemsPerRow' when container size changes.
   */
  useEffect(() => {
    if (!parentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const parentWidth = entry.contentRect.width;
        const items = calculateItemsPerRow(parentWidth);
        setItemsPerRow(items);
      }
    });

    observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, [minItemWidth, maxItemWidth]);

  /**
   * Initial calculation on mount.
   */
  useEffect(() => {
    if (parentRef.current) {
      const width = parentRef.current.offsetWidth;
      const items = calculateItemsPerRow(width);
      setItemsPerRow(items);
    }
  }, [minItemWidth, maxItemWidth]);

  /**
   * Recalculate when minibarState changes (e.g., toggling the sidebar).
   */
  useEffect(() => {
    if (parentRef.current) {
      const width = parentRef.current.offsetWidth;
      const items = calculateItemsPerRow(width);
      setItemsPerRow(items);
    }
  }, [minibarState]);

  /**
   * Total number of items displayed at the current row count.
   */
  const totalVisibleItems = rowsToShow * itemsPerRow;
  const publicationsToShow = publications.slice(0, totalVisibleItems);
  const isShowingAll = publicationsToShow.length === publications.length;

  /**
   * "Show more / Show less" button handler.
   */
  const handleShowMore = () => {
    if (isShowingAll) {
      // "Show less": revert to initial rows
      setRowsToShow(initialRows);
    } else {
      // "Show more": add rows
      setRowsToShow((prev) => prev + rowsIncrement);

      // Optional scroll-to-bottom after increment
      if (scrollOnShowMore) {
        requestAnimationFrame(() => {
          if (parentRef.current) {
            parentRef.current.scrollTo({
              top: parentRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }
        });
      }
    }
  };

  const shouldShowButton = publications.length > publicationsToShow.length || isShowingAll;

  // Gap between items
  const gap = 10;

  return (
    <>
      <Box
        ref={parentRef}
        sx={{
          display: publicationsToShow.length ? 'grid' : 'flex',
          gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
          flexWrap: 'wrap',
          gap: `${gap}px`,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          //padding: noPaddings ? 2 : 2,
          // Respect maxHeight & scrolling
          maxHeight: scrollable ? maxHeight : 'auto',
          overflowY: scrollable ? 'auto' : 'hidden',
          overflowX: 'hidden',
        }}
      >
        {publicationsToShow.map((publication) => (
          <Box
            key={publication.id}
            sx={{
              display: 'grid',
              gap: `${gap}px`,
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            }}
          >
            <ProfilePublicationItem publication={publication} />
          </Box>
        ))}

        {!publicationsToShow.length && (
          <Typography
            sx={{
              height: '20rem',
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              background: '#2b2d31',
              borderRadius: '1rem',
            }}
          >
            This profile has no posts
          </Typography>
        )}
      </Box>

      {/* "Show more" / "Show less" button */}
      {shouldShowButton && publications.length > totalVisibleItems && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={handleShowMore} variant="outlined">
            <IconCaretDown />
            <Typography sx={{ ml: 1 }}>Show more</Typography>
          </Button>
        </Box>
      )}

      {shouldShowButton && isShowingAll && publicationsToShow.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={handleShowMore} variant="outlined">
            <IconCaretUp />
            <Typography sx={{ ml: 1 }}>Show less</Typography>
          </Button>
        </Box>
      ) : null}
    </>
  );
}
