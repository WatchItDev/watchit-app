import { Typography } from '@mui/material';
import { ArrowButton } from './ArrowButtons';
import { StyledRoot } from './StyledRoot';
import {CarouselArrowIndexProps} from "@src/components/carousel/types.ts";

export default function CarouselArrowIndex({
                                             index,
                                             total,
                                             onNext,
                                             onPrev,
                                             icon,
                                             sx,
                                             ...other
                                           }: CarouselArrowIndexProps) {
  return (
    <StyledRoot blur sx={sx} {...other}>
      <ArrowButton direction="left" onClick={onPrev} icon={icon} />
      <Typography variant="subtitle2" component="span" sx={{ mx: 0.25 }}>
        {index + 1}/{total}
      </Typography>
      <ArrowButton direction="right" onClick={onNext} icon={icon} />
    </StyledRoot>
  );
}
