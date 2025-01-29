import { Box, Grid } from '@mui/material';
import { COLORS_LIST_MARKETING } from '@src/utils/colors';
import Iconify from "@src/components/iconify";

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStrategyColor } from '@redux/strategy-color';
import {RootState} from "@redux/store.ts";

const uniqueColors = Array.from(new Set(COLORS_LIST_MARKETING));

const CheckIcon = () => <Iconify sx={{ color: 'white' }} icon={'ic:baseline-check'} />

const StrategyColorPicker = () => {
  const dispatch = useDispatch();
  const selectedColor = useSelector((state: RootState) => state.strategyColor.color);

  const handleColorClick = (color: string) => {
    if (color !== selectedColor) {
      dispatch(setSelectedStrategyColor(color));
    }
  };

  return (
    <Grid container spacing={2} sx={{ py: 2, overflowX: 'auto', flexWrap: 'nowrap' }}>
      {uniqueColors.map((color) => (
        <Grid item key={color}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: selectedColor === color ? `0 0 10px ${color}` : 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleColorClick(color)}
          >
            {selectedColor === color && <CheckIcon />}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default StrategyColorPicker;
