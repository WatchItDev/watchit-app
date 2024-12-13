import { Box } from "@mui/system";
import {WatchitLoader} from "@src/components/watchit-loader";

// Get redux state from the store
import { useSelector} from 'react-redux';
import {COLORS} from "@src/layouts/config-layout.ts";

const LoaderDuringCreationProfile = () => {

const show = useSelector((state: any) => state.auth.modalCreationProfile);

  return (
    <Box sx={{
      display: show ? 'flex' : 'none',
      position: 'fixed',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.GRAY_LIGHT_50,
      zIndex: 9999,
    }} >
      {/*Centered a 50% width box*/}
      <Box sx={{
        width: '50%',
        height: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
      }}>
        <WatchitLoader />
      </Box>

    </Box>
  )
}

export default LoaderDuringCreationProfile;
