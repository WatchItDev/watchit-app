// @MUI Imports
import Box from "@mui/material/Box";

// Project imports
import { LoadingScreen } from "@src/components/loading-screen";
import { COLORS } from "@src/layouts/config-layout.ts";

const FinanceOverlayLoader = () => {
  return (
    <Box
      data-testid="loading-screen"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: COLORS.GRAY_DARK,
        opacity: 0.7,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <LoadingScreen />
    </Box>
  );
};

export default FinanceOverlayLoader;
