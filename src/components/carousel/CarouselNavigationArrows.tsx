import { FC } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import IconButton from '@mui/material/IconButton';

import {NavigationArrowsProps} from "@src/components/carousel/types";

const CarouselNavigationArrows: FC<NavigationArrowsProps> = ({ next, prev }) => (
  <>
    <IconButton onClick={prev}>
      <IconChevronLeft />
    </IconButton>
    <IconButton onClick={next}>
      <IconChevronRight />
    </IconButton>
  </>
);

export default CarouselNavigationArrows;
