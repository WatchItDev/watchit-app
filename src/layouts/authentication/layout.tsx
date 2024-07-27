// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import Main from './main';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthenticationLayout({ children }: Props) {


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

        <Main>{children}</Main>
      </Box>
    </>
  );
}
