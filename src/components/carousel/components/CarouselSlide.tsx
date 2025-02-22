import Box from '@mui/material/Box';

import { CarouselSlideProps } from '../types';
// @ts-ignore
import {Post} from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";
import {Profile } from '@lens-protocol/api-bindings';
import {createIndexForElement} from "@src/utils/text-transform.ts";

export default function CarouselSlide( props: Readonly<CarouselSlideProps<Profile | Post>>) {
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
        <Box key={`loop-one-${createIndexForElement()}`} sx={{ display: 'flex' }}>
          {rowItems.map((item, _item) => (
            <Box
              key={`loop-two-${createIndexForElement()}`}
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
