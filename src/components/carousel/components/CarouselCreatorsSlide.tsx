import Box from '@mui/material/Box';
import { UserItem } from '@src/components/user-item';
import { CarouselSlideProps } from '../variants/types';
import {Profile} from "@lens-protocol/api-bindings";

export default function CarouselCreatorsSlide({ items, itemsPerRow }: CarouselSlideProps) {
  const row1 = items.slice(0, itemsPerRow);
  const row2 = items.slice(itemsPerRow, itemsPerRow * 2);
  const itemWidthPercent = 100 / itemsPerRow;

  return (
    <Box>
      {[row1, row2].map((rowItems, rowIndex) => (
        <Box key={`row-${rowIndex}`} sx={{ display: 'flex' }}>
          {rowItems.map((item: Profile) => (
            <Box
              key={item.id}
              sx={{
                flexBasis: `${itemWidthPercent}%`,
                maxWidth: `${itemWidthPercent}%`,
                p: 1,
              }}
            >
              <UserItem profile={item} onActionFinished={() => {}} followButtonMinWidth={90} />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
