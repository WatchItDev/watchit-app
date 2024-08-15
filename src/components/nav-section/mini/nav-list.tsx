import { useState, useEffect, useRef, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import { appBarClasses } from '@mui/material/AppBar';
// routes
import { usePathname } from 'src/routes/hooks';
import { useActiveLink } from 'src/routes/hooks/use-active-link';
//
import { NavListProps, NavConfigProps } from '../types';
import NavItem from './nav-item';

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
              padding: '8px 20px',
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
        { data.title }
      </Popover>
    </>
  );
}
