import { useState, useCallback } from 'react';
// @mui
import Masonry from '@mui/lab/Masonry';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from '@src/components/iconify';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

const CURRENCIES = [
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
  { value: 'BTC', label: '฿' },
  { value: 'JPY', label: '¥' },
];

// ----------------------------------------------------------------------

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

type Props = {
  variant?: 'filled' | 'outlined' | 'standard';
};

export default function Textfield({ variant }: Props) {
  const [currency, setCurrency] = useState('EUR');

  const [values, setValues] = useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleChangeCurrency = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
  }, []);

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleShowPassword = useCallback(() => {
    setValues({ ...values, showPassword: !values.showPassword });
  }, [values]);

  const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
      <ComponentBlock title="General">
        <TextField variant={variant} fullWidth label="Inactive" />

        <TextField
          variant={variant}
          required
          fullWidth
          label="Activated"
          defaultValue="Hello watchit"
        />

        <TextField
          variant={variant}
          fullWidth
          type="password"
          label="Password"
          autoComplete="current-password"
        />

        <TextField
          variant={variant}
          disabled
          fullWidth
          label="Disabled"
          defaultValue="Hello watchit"
        />
      </ComponentBlock>

      <ComponentBlock title="With Icon & Adornments">
        <TextField
          variant={variant}
          fullWidth
          label="Filled"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:user-rounded-bold" width={24} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          variant={variant}
          disabled
          fullWidth
          label="Disabled"
          defaultValue="Hello watchit"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:user-rounded-bold" width={24} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          variant={variant}
          fullWidth
          label="With normal TextField"
          InputProps={{
            startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
          }}
        />

        <TextField
          variant={variant}
          fullWidth
          value={values.weight}
          onChange={handleChange('weight')}
          helperText="Weight"
          InputProps={{
            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
          }}
        />

        <TextField
          variant={variant}
          fullWidth
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange('password')}
          label="Password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:user-rounded-bold" width={24} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? (
                    <Iconify icon="solar:eye-bold" width={24} />
                  ) : (
                    <Iconify icon="solar:eye-closed-bold" width={24} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </ComponentBlock>

      <ComponentBlock title="With Caption">
        <TextField
          variant={variant}
          fullWidth
          label="Error"
          defaultValue="Hello watchit"
          helperText="Incorrect entry."
        />

        <TextField
          variant={variant}
          error
          fullWidth
          label="Error"
          defaultValue="Hello watchit"
          helperText="Incorrect entry."
        />
      </ComponentBlock>

      <ComponentBlock title="Type">
        <TextField
          variant={variant}
          fullWidth
          type="password"
          label="Password"
          autoComplete="current-password"
        />

        <TextField
          variant={variant}
          fullWidth
          type="number"
          label="Number"
          defaultValue={0}
          InputLabelProps={{ shrink: true }}
        />

        <TextField variant={variant} fullWidth label="Search" type="search" />
      </ComponentBlock>

      <ComponentBlock title="Sizes">
        <TextField variant={variant} fullWidth label="Size" size="small" defaultValue="Small" />

        <TextField variant={variant} fullWidth label="Size" defaultValue="Normal" />
      </ComponentBlock>

      <ComponentBlock title="Select">
        <TextField
          variant={variant}
          select
          fullWidth
          label="Select"
          value={currency}
          onChange={handleChangeCurrency}
          helperText="Please select your currency"
        >
          {CURRENCIES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          variant={variant}
          select
          fullWidth
          size="small"
          value={currency}
          label="Native select"
          SelectProps={{ native: true }}
          onChange={handleChangeCurrency}
          helperText="Please select your currency"
        >
          {CURRENCIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </ComponentBlock>

      <ComponentBlock title="Multiline">
        <TextField
          variant={variant}
          fullWidth
          label="Multiline"
          multiline
          maxRows={4}
          value="Controlled"
        />

        <TextField
          variant={variant}
          fullWidth
          multiline
          placeholder="Placeholder"
          label="Multiline Placeholder"
        />

        <TextField
          variant={variant}
          rows={4}
          fullWidth
          multiline
          label="Multiline"
          defaultValue="Default Value"
        />
      </ComponentBlock>
    </Masonry>
  );
}
