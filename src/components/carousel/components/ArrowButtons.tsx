import React from 'react';
import { StyledIconButton } from './StyledIconButton';
import { LeftIcon, RightIcon } from './CarouselArrowIcons';
import { useIsRTL } from '@src/hooks/components/use-rtl';

interface ArrowButtonProps {
  onClick?: () => void;
  direction: 'left' | 'right';
  icon?: React.ReactNode;
  filled?: boolean;
  shape?: 'circular' | 'rounded';
  sx?: object;
}

export const ArrowButton: React.FC<ArrowButtonProps> = ({
                                                          onClick,
                                                          direction,
                                                          filled = false,
                                                          shape = 'circular',
                                                          icon,
                                                          sx,
                                                        }) => {
  const isRTL = useIsRTL();
  const IconComponent = direction === 'left' ? LeftIcon : RightIcon;

  return (
    <StyledIconButton filled={filled} shape={shape} onClick={onClick} sx={sx}>
      <IconComponent icon={icon} isRTL={isRTL} />
    </StyledIconButton>
  );
};
