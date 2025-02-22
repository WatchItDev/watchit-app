import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { keyframes } from "@emotion/react";

interface CampaignConfiguredIndicatorStateProps {
  isReady: boolean;
}

// Ripple effect (only when quotaLimit is 0)
const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 0.3rem rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  100% {
    box-shadow: 0 0 0 0.7rem rgba(255, 255, 255, 0);
    transform: scale(1);
  }
`;

const CampaignConfiguredIndicatorState = ({ isReady }: CampaignConfiguredIndicatorStateProps) => {
  const theme = useTheme();
  const color = !isReady ? theme.palette.warning.main : theme.palette.success.main;

  return (
    <Tooltip title={!isReady ? "Not configured" : "Configured"}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          display: "grid",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 0.5,
          marginRight: 3,
          position: "relative",
          animation: !isReady ? `${ripple} 1.5s infinite ease-out` : "none",
          "&::before, &::after": !isReady
            ? {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              animation: "inherit",
            }
            : {},
          "&::before": !isReady ? { animationDelay: "0.5s" } : {},
          "&::after": !isReady ? { animationDelay: "1s" } : {},
        }}
      />
    </Tooltip>
  );
};

export { CampaignConfiguredIndicatorState };
