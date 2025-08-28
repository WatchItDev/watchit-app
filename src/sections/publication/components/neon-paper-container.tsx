import { FC } from 'react';
import { Paper, styled } from '@mui/material';
import { PaperProps } from '@mui/material/Paper';
import { COLORS } from '@src/layouts/config-layout.ts';
import { NeonPaperProps } from '@src/sections/publication/types.ts';

const defaultColors = [
  'rgba(30,135,255,0.5)',
  'rgba(92,19,196,0.5)',
  'rgba(255,0,51,0.5)',
  'rgba(255,218,0,0.5)',
  'rgba(100,188,38,0.5)',
  'rgba(30,135,255,0.5)',
];
const defaultAnimationSpeed = '2s';

const NeonPaper: FC<NeonPaperProps> = ({
  children,
  colors = defaultColors,
  animationSpeed = defaultAnimationSpeed,
  padding = '0.7rem',
  borderRadius = '10px',
  width = '100%',
  sx,
}) => {
  return (
    <NeonPaperContainer
      elevation={3}
      colors={colors}
      animationSpeed={animationSpeed}
      padding={padding}
      borderRadius={borderRadius}
      width={width}
      sx={sx}
    >
      <div className="neon">
        <div className="gradient"></div>
      </div>
      <div className="border">
        <div className="gradient"></div>
      </div>
      <div className="content">{children}</div>
    </NeonPaperContainer>
  );
};

export default NeonPaper;

const NeonPaperContainer = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== 'colors' &&
    prop !== 'animationSpeed' &&
    prop !== 'borderRadius' &&
    prop !== 'padding',
})<
  PaperProps & {
    colors?: string[];
    animationSpeed?: string;
    padding?: string;
    borderRadius?: string;
    width?: string;
  }
>(({ colors, animationSpeed, padding, borderRadius, width }) => ({
  '--gradient-pos-x': '50%',
  '--gradient-pos-y': '50%',
  '--border-radius': `${borderRadius || '10px'}`,
  '--border-gap': '1px',
  width: `${width || '100%'}`,
  position: 'relative',
  padding: 'var(--border-gap)',
  borderRadius: 'var(--border-radius)',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover .gradient': {
    animation: `rotate ${animationSpeed || '1s'} linear infinite`,
  },
  '& .content': {
    position: 'relative',
    padding: `${padding}`,
    color: '#ffffff',
    borderRadius: 'var(--border-radius)',
    backgroundColor: `${COLORS.GRAY_LIGHT}`,
    width: '100%',
    height: '100%',
  },
  '& .border, & .neon': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
  },
  '& .neon': {
    filter: 'blur(10px)',
    opacity: 0.5,
  },
  '& .gradient': {
    position: 'absolute',
    inset: '-200px',
    background: `conic-gradient(
  from 0deg at var(--gradient-pos-x) var(--gradient-pos-y),
${colors?.join(', ') || '#1e87ff, #5c13c4, #ff0033, #ffda00, #64bc26, #1e87ff'}
)`,
    borderRadius: 'var(--border-radius)',
    animation: `rotate ${animationSpeed || '1s'} linear infinite`,
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}));
