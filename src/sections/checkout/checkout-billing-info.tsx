// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
// types
import { IAddressItem } from 'src/types/address';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  billing: IAddressItem | null;
  onBackStep: VoidFunction;
};

export default function CheckoutBillingInfo({ billing, onBackStep }: Props) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Address"
        action={
          <Button size="small" startIcon={<Iconify icon="solar:pen-bold" />} onClick={onBackStep}>
            Edit
          </Button>
        }
      />
      <Stack spacing={1} sx={{ p: 3 }}>
        <Box sx={{ typography: 'subtitle2' }}>
          {`${billing?.name} `}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            ({billing?.addressType})
          </Box>
        </Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{billing?.fullAddress}</Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{billing?.phoneNumber}</Box>
      </Stack>
    </Card>
  );
}
