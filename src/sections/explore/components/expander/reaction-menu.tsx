import type { MutableRefObject } from 'react';
import GlassPanel from '../glass-panel';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import type { ReactionValue } from '@src/sections/explore/types';
import { alpha } from '@mui/material/styles';

interface ReactionOption {
  value: ReactionValue;
  label: string;
  icon: (props: { size?: number }) => JSX.Element;
  color: string;
  price?: number;
}

interface ReactionMenuProps {
  options: ReactionOption[];
  activeReaction: ReactionValue | null;
  menuRef: MutableRefObject<HTMLDivElement | null>;
  onSelect: (value: ReactionValue) => void;
}

/** Popover that lets the user pick a reaction. */
export const ReactionMenu = ({ options, activeReaction, menuRef, onSelect }: ReactionMenuProps) => (
  <GlassPanel
    ref={menuRef}
    sx={{
      position: 'absolute',
      right: 'calc(100% + 16px)',
      top: '-7px',
      transform: 'translateY(-50%)',
      display: 'flex',
      gap: 1.25,
      p: 1.5,
      borderRadius: 18,
      alignItems: 'center',
      zIndex: 10,
      minWidth: 0,
    }}
  >
    {options.map((option) => (
      <Tooltip
        key={option.value}
        title={`${option.label}${option.price ? ` - ${option.price} MMC` : ''}`}
        placement="top"
        arrow
      >
        <Box
          component="button"
          type="button"
          onClick={() => onSelect(option.value)}
          sx={{
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#fff',
            transition: 'transform 160ms ease',
            '&:hover': { transform: 'translateY(-6px) scale(1.06)' },
            '&:active': { transform: 'scale(0.94)' },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                activeReaction === option.value
                  ? alpha(option.color, 0.26)
                  : 'linear-gradient(135deg, rgba(18,22,32,0.68), rgba(10,12,24,0.42))',
              border:
                activeReaction === option.value
                  ? `2px solid ${option.color}`
                  : '1px solid rgba(255,255,255,0.22)',
              boxShadow:
                activeReaction === option.value
                  ? `0 0 0 5px ${alpha(option.color, 0.18)}`
                  : '0 12px 22px rgba(4,8,18,0.45)',
              backdropFilter: activeReaction === option.value ? undefined : 'blur(18px)',
              WebkitBackdropFilter: activeReaction === option.value ? undefined : 'blur(18px)',
              transition: 'background 160ms ease, border 160ms ease, box-shadow 160ms ease, transform 160ms ease',
            }}
          >
            <option.icon size={16} />
          </Box>
        </Box>
      </Tooltip>
    ))}
  </GlassPanel>
);
