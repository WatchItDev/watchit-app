import { ArrowIconProps } from '@src/components/carousel/types.ts'
import Iconify from '@src/components/iconify'

export function LeftIcon({ icon = 'eva:arrow-ios-forward-fill', isRTL }: Readonly<ArrowIconProps>) {
  return (
    <Iconify
      data-testid="leftButton"
      icon={icon}
      sx={{
        transform: ' scaleX(-1)',
        ...(isRTL && {
          transform: ' scaleX(1)',
        }),
      }}
    />
  )
}

export function RightIcon({ icon = 'eva:arrow-ios-forward-fill', isRTL }: Readonly<ArrowIconProps>) {
  return (
    <Iconify
      data-testid="rightButton"
      icon={icon}
      sx={{
        ...(isRTL && {
          transform: ' scaleX(-1)',
        }),
      }}
    />
  )
}
