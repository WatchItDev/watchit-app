import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProfilePublicationItem } from './profile-publication-item';
import IconButton from '@mui/material/IconButton';
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';

interface ProfileHomeProps {
  publications: any;
  noPaddings?: boolean;
  showAll?: boolean;
}

export default function ProfileHome({
  publications,
  noPaddings = false,
  showAll = false,
}: ProfileHomeProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const minItemWidth = 180;
  const maxItemWidth = 250;
  const gap = 10; // Space between items
  const [itemsPerRow, setItemsPerRow] = useState(4); // Default items per row
  const [rowsToShow, setRowsToShow] = useState(1);
  const [allItemsShown, setAllItemsShown] = useState(false);

  const calculateItemsPerRow = (parentWidth: number) => {
    let maxItems = Math.floor(parentWidth / minItemWidth);
    let minItems = Math.floor(parentWidth / maxItemWidth);
    let items = maxItems;

    while (items >= minItems) {
      const itemWidth = parentWidth / items;
      if (itemWidth >= minItemWidth && itemWidth <= maxItemWidth) {
        break;
      }
      items--;
    }

    if (items < 1) items = 1;

    return items;
  };

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

    return () => {
      observer.disconnect();
    };
  }, [minItemWidth, maxItemWidth]);

  useEffect(() => {
    if (parentRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      const items = calculateItemsPerRow(parentWidth);
      setItemsPerRow(items);
    }
  }, [minItemWidth, maxItemWidth]);

  // Filter publications to show
  const displayedPublications = showAll
    ? publications
    : publications
      ? publications.slice(0, 10)
      : [];

  const handleShowMore = () => {
    if (allItemsShown) {
      setRowsToShow(1);
      setAllItemsShown(false);
    } else {
      setRowsToShow((prevRows) => {
        const newRows = prevRows + 1;
        if (newRows * itemsPerRow >= displayedPublications.length) {
          setAllItemsShown(true);
        }
        return newRows;
      });
    }
  };

  const publicationsToShow = displayedPublications.slice(0, rowsToShow * itemsPerRow);

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
          padding: noPaddings ? 0 : 2,
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
      <Box>
        {publicationsToShow.length < displayedPublications.length || allItemsShown ? (
          <>
            <IconButton onClick={handleShowMore} sx={{ mt: 2 }}>
              {allItemsShown ? <IconCaretUp /> : <IconCaretDown />}
            </IconButton>
          </>
        ) : null}
      </Box>
    </>
  );
}
