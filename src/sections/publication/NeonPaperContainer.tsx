import {FC, ReactNode} from "react";

import { Paper, styled } from '@mui/material';
import {PaperProps} from "@mui/material/Paper";
import {SxProps, Theme} from "@mui/material/styles";
import {COLORS} from "@src/layouts/config-layout.ts";

interface NeonPaperProps {
  children: ReactNode;
  colors?: string[];
  animationSpeed?: string;
  sx?: SxProps<Theme>;
}

const NeonPaperContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'colors' && prop !== 'animationSpeed',
})<PaperProps & {colors?: string[], animationSpeed?: string} >(({ colors, animationSpeed }) => ({
  '--gradient-pos-x': '50%',
  '--gradient-pos-y': '50%',
  '--border-radius': '10px',
  '--border-gap': '1px',
  width: '100%',
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
    padding: '1rem',
    color: '#ffffff',
    borderRadius: 'var(--border-radius)',
    backgroundColor: `${COLORS.GRAY_LIGHT}`,
    width: '100%',
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

const NeonPaper: FC<NeonPaperProps> = ({ children, colors, animationSpeed }) => {
  return (
    <NeonPaperContainer
      elevation={3}
      colors={colors}
      animationSpeed={animationSpeed}
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
