// REACT IMPORTS
import { FC } from "react";

// MUI IMPORTS
import { Box } from "@mui/system";

// LOCAL IMPORTS
import { LoadingScreen } from "@src/components/loading-screen";

const FinanceMetamaskLoader: FC = () => {
  return (
    <Box sx={{ mx: 4, my: 8 }}>
      <LoadingScreen data-testid="finance-metamask-loader" />
    </Box>
  );
};

export default FinanceMetamaskLoader;
