import { FC } from 'react';
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { NavigationArrowsProps } from '@src/components/carousel/types.ts';

const CarouselNavigationArrows: FC<NavigationArrowsProps> = ({ next, prev }) => (
  <>
    <IconButton data-testid={'leftButton'} onClick={prev}>
      <IconChevronLeft />
    </IconButton>
    <IconButton data-testid={'rightButton'} onClick={next}>
      <IconChevronRight />
    </IconButton>
  </>
);

export default CarouselNavigationArrows;
