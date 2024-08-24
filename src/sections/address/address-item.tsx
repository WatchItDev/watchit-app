// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { IAddressItem } from 'src/types/address';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = PaperProps &
  StackProps & {
    action?: React.ReactNode;
    address: IAddressItem;
  };

export default function AddressItem({ address, action, sx, ...other }: Props) {
  const { name, fullAddress, addressType, phoneNumber, primary } = address;

  return (
    <Stack
      component={Paper}
      spacing={2}
      alignItems={{ md: 'flex-end' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {name}
            <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
              ({addressType})
            </Box>
          </Typography>

          {primary && (
            <Label color="info" sx={{ ml: 1 }}>
              Default
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {fullAddress}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {phoneNumber}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}
