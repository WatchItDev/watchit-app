// @mui
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { IPaymentCard } from 'src/types/payment';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type PaymentItemProps = StackProps & {
  card: IPaymentCard;
};

export default function PaymentCardItem({ card, sx, ...other }: PaymentItemProps) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1}
        component={Paper}
        variant="outlined"
        sx={{
          p: 2.5,
          width: 1,
          position: 'relative',
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon={(card.cardType === 'visa' && 'logos:visa') || 'logos:mastercard'}
            width={36}
          />

          {card.primary && <Label color="info">Default</Label>}
        </Stack>

        <Typography variant="subtitle2">{card.cardNumber}</Typography>

        <IconButton
          onClick={popover.onOpen}
          sx={{
            top: 8,
            right: 8,
            position: 'absolute',
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={popover.onClose} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
