import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export const ExploreTopPublicationsSkeleton: React.FC = () => {
  return (
    <Box sx={styles.wrapper}>
      <Skeleton
        data-testid="skeleton-item"
        variant="rectangular"
        width={"100%"}
        height={"100%"}
        sx={{ mb: 1, mx: 0.5, mt: 2, borderRadius: 1 }}
      />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          gap={4}>
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: 1,
              width: { xs: "12rem", sm: "18rem" },
              height: { xs: "12rem", sm: "18rem" },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: { xs: "100%", sm: "auto" },
              px: 3,
            }}
            gap={2}>
            <Skeleton
              variant="rectangular"
              width={"14rem"}
              height={"2.5rem"}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={"8rem"}
              height={"2rem"}
              sx={{ borderRadius: 1 }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "100%", sm: "auto" },
              }}
              gap={1}>
              <Skeleton
                variant="rectangular"
                height={"1.2rem"}
                sx={{
                  borderRadius: 1,
                  width: { xs: "100%", sm: "18rem" },
                }}
              />
              <Skeleton
                variant="rectangular"
                height={"1.2rem"}
                sx={{
                  borderRadius: 1,
                  width: { xs: "100%", sm: "18rem" },
                }}
              />
              <Skeleton
                variant="rectangular"
                height={"1.2rem"}
                sx={{
                  borderRadius: 1,
                  width: { xs: "100%", sm: "18rem" },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
              gap={1}>
              <Skeleton
                variant="rectangular"
                width={"8rem"}
                height={"2.5rem"}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={"2.5rem"}
                height={"2.5rem"}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    height: { xs: "600px", sm: "500px" },
  },
};
