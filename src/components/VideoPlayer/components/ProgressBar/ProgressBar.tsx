import React, { useState, useEffect, useRef, FC } from 'react';
import { styled, Box } from '@mui/material';
/* import { withTheme } from '../../../hoc/withTheme' */

type ProgressBarProps = {
  percentage: number;
  backgroundColor?: string;
  barColor?: string;
  showBullet?: boolean;
  onNewPercentage: (increaseValue: number) => void;
};

const ProgressBar: FC<ProgressBarProps> = ({
  percentage,
  backgroundColor,
  barColor,
  showBullet,
  onNewPercentage,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarBallRef = useRef<HTMLDivElement>(null);
  const [percentageState, setPercentage] = useState<number>(percentage);

  const handleMouseDown = () => {
    if (!showBullet) return;

    const moveProgress = (e: MouseEvent) => {
      const currentX = e.clientX;
      const left = progressBarRef.current!.offsetLeft;
      const progressWidth = progressBarRef.current!.offsetWidth;
      const newPercentage = ((currentX - left) / progressWidth) * 100;

      if (newPercentage >= 0 && newPercentage <= 100) setPercentage(newPercentage);
      onNewPercentage(newPercentage);
    };
    const stopProgress = () => {
      document.removeEventListener('mousemove', moveProgress);
      document.removeEventListener('mouseup', stopProgress);
    };
    progressBarRef.current!.addEventListener('click', moveProgress);
    document.addEventListener('mousemove', moveProgress);
    document.addEventListener('mouseup', stopProgress);
  };

  useEffect(() => {
    setPercentage(percentage);
  }, [percentage]);

  return (
    <ProgressBarWrapper
      ref={progressBarRef}
      data-testid="progress-bar"
      onMouseDown={handleMouseDown}
    >
      <ProgressBarBackground
        backgroundColor={backgroundColor}
        data-testid="progress-bar-background"
      />
      <ProgressBarContent
        barColor={barColor}
        percentage={percentageState}
        data-testid="progress-bar-content"
      >
        {showBullet && (
          <ProgressBarBall
            barColor={barColor}
            ref={progressBarBallRef}
            data-testid="progress-bar-ball"
          />
        )}
      </ProgressBarContent>
    </ProgressBarWrapper>
  );
};

type ProgressBarWrapperProps = {};
const ProgressBarWrapper = styled(Box)<ProgressBarWrapperProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',
  width: '100%',
  position: 'relative',
  '*': {
    userSelect: 'none',
  },
}));

type ProgressBarBackgroundProps = { backgroundColor?: string };
const ProgressBarBackground = styled(Box)<ProgressBarBackgroundProps>(({ backgroundColor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '100%',
  height: '5px',
  borderRadius: '5px',
  backgroundColor: backgroundColor ?? 'rgba(81,92,103,0.4)',
}));

type ProgressBarContentProps = { barColor?: string; percentage: number };
const ProgressBarContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'barColor' && prop !== 'percentage',
})<ProgressBarContentProps>(({ barColor, percentage }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  height: '5px',
  boxShadow: '0px 2px 4px  1px rgb(0 0 0 / 40%)',
  borderRadius: '5px',
  backgroundColor: barColor ?? '#FFFFFF',
  width: `${percentage}%`,
}));

type ProgressBarBallProps = { barColor?: string };
const ProgressBarBall = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'barColor',
})<ProgressBarBallProps>(({ barColor }) => ({
  position: 'absolute',
  top: '-5px',
  right: '-7px',
  borderRadius: '50%',
  height: '15px',
  width: '15px',
  boxShadow: '0px 2px 4px 1px rgb(0 0 0 / 40%)',
  backgroundColor: barColor ?? '#FFFFFF',
}));

export default ProgressBar;
