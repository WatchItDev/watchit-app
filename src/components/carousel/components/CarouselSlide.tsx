import Box from '@mui/material/Box';
import { CarouselSlideProps } from '../types';

export default function CarouselSlide<T>( props: CarouselSlideProps<T>) {
  const {
    items,
      itemsPerRow,
      renderItem,
  } = props;
  const row1 = items.slice(0, itemsPerRow);
  const row2 = items.slice(itemsPerRow, itemsPerRow * 2);
  const itemWidthPercent = 100 / itemsPerRow;

  return (
    <Box>
      {[row1, row2].map((rowItems, rowIndex) => (
        <Box key={`row-${rowIndex}`} sx={{ display: 'flex' }}>
          {rowItems.map((item, itemIndex) => (
            <Box
              key={`item-${itemIndex}`}
              sx={{
                flexBasis: `${itemWidthPercent}%`,
                maxWidth: `${itemWidthPercent}%`,
                p: 1,
              }}
            >
              {renderItem(item)}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
