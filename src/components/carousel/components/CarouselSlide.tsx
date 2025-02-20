import Box from '@mui/material/Box';

import { CarouselSlideProps } from '../types';

export default function CarouselSlide<T>( props: Readonly<CarouselSlideProps<T>>) {
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
      {[row1, row2].map((rowItems, _rowIndex) => (
        <Box key={`row-${_rowIndex}`} sx={{ display: 'flex' }}>
          {rowItems.map((item, _item) => (
            <Box
              key={`item-${_rowIndex}-${_item}`}
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
