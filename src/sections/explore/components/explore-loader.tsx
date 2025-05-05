import { Box } from "@mui/system";
import { LoadingScreen } from "@src/components/loading-screen";

const ExploreLoader = () => {
  return (
    <Box
      sx={{
        zIndex: 999,
        background: "#1E1F22",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        pointerEvents: "none",
        right: 0,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <LoadingScreen />
      </Box>
    </Box>
  );
};

export default ExploreLoader;
