import Image from "@src/components/image";
import Stack from "@mui/material/Stack";
import {FC} from "react";

interface ProcessIllustrationCardProps {
  illustration: string;
  alt?: string;
}

const ProcessIllustrationCard: FC<ProcessIllustrationCardProps> = ({illustration, alt}) => {
  return (
    <Stack
      flexGrow={1}
      justifyContent="center"
      sx={{
        display: {xs: "flex", md: "flex"},
        p: {xs: 1, md: 1},
        mb: {xs: 1, md: 0},
        mx: "auto",
        order: {xs: 1, md: 2},
      }}>
      <Image
        sx={{
          objectFit: "contain",
        }}
        src={illustration}
        alt={alt}
      />
    </Stack>
  );
};

export default ProcessIllustrationCard;
