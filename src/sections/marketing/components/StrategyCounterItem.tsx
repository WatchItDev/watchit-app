import {FC} from "react";

// MUI components
import {Box} from "@mui/system";
import {Typography} from "@mui/material";

// Types
import {CounterItemProps} from "@src/types/marketing";

const StrategyCounterItem: FC<CounterItemProps> = ({ icon, number,label }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: .3,
      textAlign: 'center',
      p: 2,
      borderRadius: 1.5,
      border: '1px solid rgba(145, 158, 171, 0.16)',
      width: 'calc(33.33% - 0.5rem)',
    }}>
      <Box>
        {icon}
      </Box>
      <Typography variant="h4" sx={{
        color: 'text.secondary'
      }}>
        {number}
      </Typography>
      <Typography variant="body1" sx={{
        color: 'text.secondary'
      }}>
        {label}
      </Typography>
    </Box>
  )
}

export default StrategyCounterItem;
