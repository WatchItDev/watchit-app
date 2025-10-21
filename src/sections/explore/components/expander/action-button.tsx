import { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/material/styles';

interface ActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode;
  label?: ReactNode;
  tooltip?: string;
  active?: boolean;
  iconWrapperSx?: SxProps<Theme>;
}

/** Shared icon button used across the expander action rail. */
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ icon, label, tooltip, active = false, iconWrapperSx, disabled, ...buttonProps }, ref) => {
    const tooltipLabel = tooltip ?? '';
    const showBadge = label !== undefined && label !== null && label !== '';

    return (
      <Stack spacing={0} alignItems="center" component="div">
        <Tooltip
          title={tooltipLabel}
          placement="left"
          arrow
          disableHoverListener={!tooltipLabel}
          disableFocusListener={!tooltipLabel}
          disableTouchListener={!tooltipLabel}
        >
          <span style={{ display: 'inline-flex' }}>
            <Box
              component="button"
              type="button"
              ref={ref}
              disabled={disabled}
              {...buttonProps}
              sx={{
                position: 'relative',
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)',
                border: active ? '1px solid rgba(255,255,255,0.48)' : '1px solid rgba(255,255,255,0.24)',
                color: '#fff',
                cursor: disabled ? 'default' : 'pointer',
                transition: 'transform 160ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
                opacity: disabled ? 0.5 : 1,
                boxShadow: active ? '0 12px 28px rgba(0,0,0,0.45)' : '0 10px 22px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                '&:hover': disabled ? undefined : { transform: 'translateY(-2px)' },
                ...iconWrapperSx,
              }}
            >
              {icon}
              {showBadge ? (
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    minWidth: 20,
                    height: 20,
                    px: 0.75,
                    borderRadius: 999,
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    color: '#fff',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                  }}
                >
                  {label}
                </Box>
              ) : null}
            </Box>
          </span>
        </Tooltip>
      </Stack>
    );
  },
);

ActionButton.displayName = 'ExpanderActionButton';
