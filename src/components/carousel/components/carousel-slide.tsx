import Box from '@mui/material/Box';
import { memo, FC } from 'react';
import { CarouselSlideProps } from '../types';
import { Post, User } from '@src/graphql/generated/graphql.ts';

const CarouselSlide: FC<Readonly<CarouselSlideProps<User | Post>>> = (props) => {
  const { items, itemsPerRow, renderItem, } = props;
  const row1 = items.slice(0, itemsPerRow);
  const row2 = items.slice(itemsPerRow, itemsPerRow * 2);
  const itemWidthPercent = 100 / itemsPerRow;

  return (
    <Box>
      {[row1, row2].map((rowItems, _rowIndex) => (
        <Box key={`loop-one-${rowItems[_rowIndex]?.id ?? rowItems[_rowIndex]?.address}`} sx={{ display: 'flex' }}>
          {rowItems.map((item) => (
            <Box
              key={`loop-two-${item?.id ?? item?.address}`}
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

export default memo(CarouselSlide, (prevProps, nextProps) => prevProps.items === nextProps.items);
