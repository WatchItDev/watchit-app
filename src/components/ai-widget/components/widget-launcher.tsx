import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { icons } from '@tabler/icons-react';
import { floatPulse, glow } from '../styles';

const Root = styled('div')(({}) => ({
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 1400,
}));

export default function WidgetLauncher({ onOpen }: { onOpen: () => void }) {
  return (
    <Root>
      <Tooltip title="Watchit AI">
        <Badge overlap="circular" color="primary" variant="dot" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Fab size="medium" onClick={onOpen} sx={(t) => ({ animation: `${floatPulse} 2.4s ease-in-out infinite`, boxShadow: glow(t.palette.primary.main) })}>
            <icons.IconSparkles size={20} />
          </Fab>
        </Badge>
      </Tooltip>
    </Root>
  );
}
