import { Ref, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Input, { InputProps, inputClasses } from '@mui/material/Input';

const STEP = 50;
const MIN_AMOUNT = 0;

export interface InputAmountProps extends InputProps {
  max: number;
  amount: number | number[];
  inputRef?: Ref<HTMLInputElement>;
}

export const InputAmount = ({
  amount,
  onBlur,
  onChange,
  max,
  sx,
  inputRef,
  ...other
}: InputAmountProps) => {
  const [autoWidth, setAutoWidth] = useState(32);

  useEffect(() => {
    const getNumberLength = amount.toString().length || 1;
    setAutoWidth(getNumberLength * 24);
  }, [amount]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={sx}
    >
      <Input
        // disableUnderline
        size="small"
        placeholder="0"
        value={amount === 0 ? '' : amount}
        onChange={onChange}
        onBlur={onBlur}
        inputRef={inputRef}
        inputProps={{
          step: STEP,
          min: MIN_AMOUNT,
          max: max,
          type: 'number',
        }}
        sx={{
          [`& .${inputClasses.input}`]: {
            p: 0,
            typography: 'h3',
            textAlign: 'center',
            width: `${autoWidth}px`,
            transition: 'width 0.2s ease-in-out',
          },
        }}
        {...other}
      />

      <Typography variant="h5">MMC</Typography>
    </Stack>
  );
};
