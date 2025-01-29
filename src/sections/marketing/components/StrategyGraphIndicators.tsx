import {FC} from "react";

import {Box} from "@mui/system";
import {Typography} from "@mui/material";

import {COLORS_LIST_MARKETING, darken} from "@src/utils/colors.ts";
import StrategyProgress from "@src/sections/marketing/components/StrategyProgress.tsx";
import StrategyCircles from "@src/sections/marketing/components/StrategyCircles.tsx";


interface StrategyGraphIndicatorsProps {
  index: number;
  strategy: {
    budget: number;
    available: number;
  }
}

const StrategyGraphIndicators: FC<StrategyGraphIndicatorsProps> = ({index, strategy}) => {
  return (
    <Box sx={{
      flexGrow: 1,
      background: `linear-gradient(135deg, ${COLORS_LIST_MARKETING[index]} 0%, ${darken(COLORS_LIST_MARKETING[index],120)} 100%)`,
      borderRadius: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      px: 2,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <StrategyProgress
        colors={
          {
            start: COLORS_LIST_MARKETING[index],
            end: darken(COLORS_LIST_MARKETING[index], 50)
          }
        }
        chart={{
          series: [
            { label: 'Total', value: strategy.budget },
            { label: 'Available', value: strategy.available },
          ]
        }}
      />
      <Typography  color="text.white" fontSize={'2rem'} >
        <Box component={'small'} sx={{fontSize:'1.2rem', color: '#CCC'}}>Budget</Box>
        <br/>
        <Box sx={{fontWeight:'bold'}}>{strategy.budget}</Box>
      </Typography>

      <Typography color="text.white" fontSize={'2rem'} sx={{zIndex: 2}}>
        <Box component={'small'} sx={{fontSize:'1.2rem', color: '#CCC'}}>Available</Box>
        <br/>
        <Box sx={{fontWeight:'bold'}}>{strategy.available}</Box>
      </Typography>
      <StrategyCircles color={darken(COLORS_LIST_MARKETING[index])} />
    </Box>
  )

}

export default StrategyGraphIndicators;
