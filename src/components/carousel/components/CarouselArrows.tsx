import { Stack } from '@mui/material';
import { ArrowButton } from './ArrowButtons';
import {CarouselArrowsProps} from "@src/components/carousel/types.ts";

export default function CarouselArrows({
                                         shape,
                                         filled,
                                         icon,
                                         onNext,
                                         onPrev,
                                         children,
                                         leftButtonProps,
                                         rightButtonProps,
                                         sx,
                                         ...other
                                       }: CarouselArrowsProps) {
  const hasChild = !!children;

  if (hasChild) {
    return (
      <Stack sx={sx} {...other}>
        {onNext && (
          <ArrowButton
            direction="left"
            onClick={onPrev}
            filled={filled}
            shape={shape}
            icon={icon}
            {...leftButtonProps}
            sx={{ left: 16, ...leftButtonProps?.sx }}
          />
        )}
        {children}
        {onPrev && (
          <ArrowButton
            direction="right"
            onClick={onNext}
            filled={filled}
            shape={shape}
            icon={icon}
            {...rightButtonProps}
            sx={{ right: 16, ...rightButtonProps?.sx }}
          />
        )}
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems="center" display="inline-flex" sx={sx} {...other}>
      <ArrowButton direction="left" onClick={onPrev} filled={filled} shape={shape} icon={icon} {...leftButtonProps} />
      <ArrowButton direction="right" onClick={onNext} filled={filled} shape={shape} icon={icon} {...rightButtonProps} />
    </Stack>
  );
}
