import React from 'react';

// MUI components
import { Grid } from '@mui/material';

// Project components
import { StrategyListProps } from '@src/types/marketing';

import StrategyItem from "@src/sections/marketing/components/StrategyItem.tsx";

const StrategyList: React.FC<StrategyListProps> = ({ data }) => {
  return (
    <Grid
      container
      spacing={1}
      sx={{
        mt: 0,
      }}
    >
      {data.map((strategy, index) => <StrategyItem key={`key-strategy-${index}`} strategy={strategy} index={index} />)}
    </Grid>
  );
};



export default StrategyList;
