import Box from '@mui/material/Box';
import { memo, FC } from 'react';
import { CarouselSlideProps } from '../types';
// @ts-expect-error No error in this context
import { Post } from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";
import { Profile } from '@lens-protocol/api-bindings';

const CarouselSlide: FC<Readonly<CarouselSlideProps<Profile | Post>>> = (props) => {
  const { items, itemsPerRow, renderItem, } = props;
  const row1 = items.slice(0, itemsPerRow);
  const row2 = items.slice(itemsPerRow, itemsPerRow * 2);
  const itemWidthPercent = 100 / itemsPerRow;

  return (
    <Box>
      {[row1, row2].map((rowItems, _rowIndex) => (
        <Box key={`loop-one-${rowItems[_rowIndex]?.id}`} sx={{ display: 'flex' }}>
          {rowItems.map((item, _item) => (
            <Box
              key={`loop-two-${item?.id}`}
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
