import { useState, useEffect, useRef, useCallback } from 'react';
// @mui
import Popover from '@mui/material/Popover';
import { appBarClasses } from '@mui/material/AppBar';
// routes
import { usePathname } from '@src/routes/hooks';
//
import { NavListProps, NavConfigProps } from '../types';
import NavItem from './nav-item';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps;
  active?: boolean;
  depth: number;
  config: NavConfigProps;
  onClick?: () => void
};

export default function NavList({ data, active, depth, config, onClick }: NavListRootProps) {
  const navRef = useRef(null);

  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const appBarEl = Array.from(
      document.querySelectorAll(`.${appBarClasses.root}`)
    ) as Array<HTMLElement>;

    // Reset styles when hover
    const styles = () => {
      document.body.style.overflow = '';
      document.body.style.padding = '';
      // Apply for Window
      appBarEl.forEach((elem) => {
        elem.style.padding = '';
      });
    };

    if (open) {
      styles();
    } else {
      styles();
    }
  }, [open]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NavItem
        ref={navRef}
        item={data}
        depth={depth}
        open={open}
        active={active || open}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        config={config}
        onClick={onClick}
      />

      <Popover
        open={open}
        anchorEl={navRef.current}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        slotProps={{
          paper: {
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
            sx: {
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '8px 8px',
              ...(open && {
                pointerEvents: 'auto',
              }),
            },
          },
        }}
        sx={{
          pointerEvents: 'none'
        }}
      >
          <Stack spacing={1} direction={'row'}>
            { data.title }
            { data.badge && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFAB00',
                borderRadius: '8px',
                padding: '2px 4px',
                color: 'black',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                { data.badge}
              </Box>
            )}
          </Stack>
      </Popover>
    </>
  );
}
