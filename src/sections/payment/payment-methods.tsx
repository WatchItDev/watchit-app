import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Paper, { PaperProps } from '@mui/material/Paper';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
//
import PaymentNewCardDialog from './payment-new-card-dialog';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    label: 'Paypal',
  },
  {
    value: 'credit',
    label: 'Credit / Debit Card',
  },
];

const CARD_OPTIONS = [
  {
    value: 'visa1',
    label: '**** **** **** 1212 - Jimmy Holland',
  },
  {
    value: 'visa2',
    label: '**** **** **** 2424 - Shawn Stokes',
  },
  {
    value: 'mastercard',
    label: '**** **** **** 4545 - Cole Armstrong',
  },
];

// ----------------------------------------------------------------------

export default function PaymentMethods() {
  const newCard = useBoolean();

  const [method, setMethod] = useState('paypal');

  const handleChangeMethod = useCallback((newValue: string) => {
    setMethod(newValue);
  }, []);

  return (
    <>
      <Stack spacing={5}>
        <Typography variant="h6">Payment Method</Typography>

        <Stack spacing={3}>
          {PAYMENT_OPTIONS.map((option) => (
            <OptionItem
              key={option.label}
              option={option}
              selected={method === option.value}
              isCredit={option.value === 'credit' && method === 'credit'}
              onOpen={newCard.onTrue}
              onClick={() => handleChangeMethod(option.value)}
            />
          ))}
        </Stack>
      </Stack>

      <PaymentNewCardDialog open={newCard.value} onClose={newCard.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  option: {
    value: string;
    label: string;
  };
  selected: boolean;
  isCredit: boolean;
  onOpen: VoidFunction;
};

function OptionItem({ option, selected, isCredit, onOpen, ...other }: OptionItemProps) {
  const { value, label } = option;

  return (
    <Paper
      variant="outlined"
      key={value}
      sx={{
        p: 2.5,
        cursor: 'pointer',
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
      }}
      {...other}
    >
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center">
            <Iconify
              icon={selected ? 'eva:checkmark-circle-2-fill' : 'eva:radio-button-off-fill'}
              width={24}
              sx={{
                mr: 2,
                color: selected ? 'primary.main' : 'text.secondary',
              }}
            />

            <Box component="span" sx={{ flexGrow: 1 }}>
              {label}
            </Box>

            <Stack spacing={1} direction="row" alignItems="center">
              {value === 'credit' && (
                <>
                  <Iconify icon="logos:mastercard" width={24} />,
                  <Iconify icon="logos:visa" width={24} />
                </>
              )}
              {value === 'paypal' && <Iconify icon="logos:paypal" width={24} />}
              {value === 'cash' && <Iconify icon="solar:wad-of-money-bold" width={24} />}
            </Stack>
          </Stack>
        }
        primaryTypographyProps={{ typography: 'subtitle2' }}
      />

      {isCredit && (
        <Stack
          spacing={2.5}
          alignItems="flex-end"
          sx={{
            pt: 2.5,
          }}
        >
          <TextField select fullWidth label="Cards" SelectProps={{ native: true }}>
            {CARD_OPTIONS.map((card) => (
              <option key={card.value} value={card.value}>
                {card.label}
              </option>
            ))}
          </TextField>

          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpen}
          >
            Add New Card
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
