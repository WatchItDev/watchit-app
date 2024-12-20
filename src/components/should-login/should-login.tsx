import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {COLORS} from "@src/layouts/config-layout.ts";
import {openLoginModal} from "@redux/auth";
import {useDispatch, useSelector} from "react-redux";

const notLoggedIn = () => {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);

  const handleClicked = () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: COLORS.GRAY_DARK,
        color: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
      }}
    >
      <Typography variant="h4">Please log in to view this content</Typography>
      <Button
        onClick={handleClicked}
        sx={{
        backgroundColor: COLORS.GRAY_LIGHT,
        color: 'white',
        '&:hover': {
          backgroundColor: COLORS.GRAY_DARK,
        }
      }}>
        Log in
      </Button>
    </Box>
  );
}

export default notLoggedIn;
