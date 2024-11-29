import IconButton from "@mui/material/IconButton";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import {FC} from "react";

interface NavigationArrowsProps {
  next: () => void;
  prev: () => void;
}

const NavigationArrows: FC<NavigationArrowsProps> = ({ next, prev }) => (
  <>
  <IconButton onClick={next} >
    <IconChevronLeft />
  </IconButton>
<IconButton onClick={prev} >
  <IconChevronRight />
</IconButton>
  </>
)

export default NavigationArrows;

