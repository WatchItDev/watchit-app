// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  total: number;
  discount?: number;
  subTotal: number;
  shipping?: number;
  //
  onEdit?: VoidFunction;
  onApplyDiscount?: (discount: number) => void;
};

export default function CheckoutSummary({
  total,
  discount,
  subTotal,
  shipping,
  //
  onEdit,
  onApplyDiscount,
}: Props) {
  const displayShipping = shipping !== null ? 'Free' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order Summary"
        action={
          onEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subTotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Shipping
            </Typography>
            <Typography variant="subtitle2">
              {shipping ? fCurrency(shipping) : displayShipping}
            </Typography>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (VAT included if applicable)
              </Typography>
            </Box>
          </Stack>

          {onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="primary" onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
