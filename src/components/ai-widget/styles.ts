import { alpha, keyframes, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export const floatPulse = keyframes`
  0% { box-shadow: 0 10px 30px rgba(0,0,0,0.18); transform: translateY(0); }
  50% { box-shadow: 0 16px 36px rgba(0,0,0,0.24); transform: translateY(-2px); }
  100% { box-shadow: 0 10px 30px rgba(0,0,0,0.18); transform: translateY(0); }
`;

export const glow = (color: string) => `0 0 0 1px ${alpha(color, 0.2)}, 0 6px 20px ${alpha(color, 0.35)}`;

export const WidgetSurface = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
  background: alpha('#0e1319', 0.92),
}));
