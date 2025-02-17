//
import Iconify from '../iconify';
import {ArrowIconProps} from "@src/components/carousel/types";

// ----------------------------------------------------------------------

export function LeftIcon({ icon = 'eva:arrow-ios-forward-fill', isRTL }: ArrowIconProps) {
  return (
    <Iconify
      icon={icon}
      sx={{
        transform: ' scaleX(-1)',
        ...(isRTL && {
          transform: ' scaleX(1)',
        }),
      }}
    />
  );
}

export function RightIcon({ icon = 'eva:arrow-ios-forward-fill', isRTL }: ArrowIconProps) {
  return (
    <Iconify
      icon={icon}
      sx={{
        ...(isRTL && {
          transform: ' scaleX(-1)',
        }),
      }}
    />
  );
}
