import { FC } from 'react';
import { icons } from '@tabler/icons-react';
import IconButton from '@mui/material/IconButton';
import { NavigationArrowsProps } from '@src/components/carousel/types.ts';

const CarouselNavigationArrows: FC<NavigationArrowsProps> = ({
  next,
  prev,
}) => (
  <>
    <IconButton data-testid={'leftButton'} onClick={prev}>
      <icons.IconChevronLeft />
    </IconButton>
    <IconButton data-testid={'rightButton'} onClick={next}>
      <icons.IconChevronRight />
    </IconButton>
  </>
);

export default CarouselNavigationArrows;
