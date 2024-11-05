// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from '@src/hooks/use-boolean';
//
import Main from './main';
// import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const nav = useBoolean();

  return (
    <>
      {/* <Header onOpenNav={nav.onTrue} /> */}

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <NavMini />
        <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
        <Main>{children}</Main>
      </Box>
    </>
  );
}
