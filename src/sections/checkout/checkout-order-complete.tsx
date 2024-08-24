import { m, AnimatePresence } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// assets
import { OrderCompleteIllustration } from 'src/assets/illustrations';
// components
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onReset: VoidFunction;
  onDownloadPDF: VoidFunction;
}

export default function CheckoutOrderComplete({ open, onReset, onDownloadPDF }: Props) {
  const renderContent = (
    <Stack
      spacing={5}
      sx={{
        m: 'auto',
        maxWidth: 480,
        textAlign: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
      <Typography variant="h4">Thank you for your purchase!</Typography>

      <OrderCompleteIllustration sx={{ height: 260 }} />

      <Typography>
        Thanks for placing order
        <br />
        <br />
        <Link>01dc1370-3df6-11eb-b378-0242ac130002</Link>
        <br />
        <br />
        We will send you a notification within 5 days when it ships.
        <br /> If you have any question or queries then fell to get in contact us. <br /> <br />
        All the best,
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column-reverse', sm: 'row' }}
      >
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={onReset}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>

        <Button
          fullWidth
          size="large"
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-download-fill" />}
          onClick={onDownloadPDF}
        >
          Download as PDF
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          fullScreen
          open={open}
          PaperComponent={(props: PaperProps) => (
            <Box
              component={m.div}
              {...varFade({
                distance: 120,
                durationIn: 0.32,
                durationOut: 0.24,
                easeIn: 'easeInOut',
              }).inUp}
              sx={{
                width: 1,
                height: 1,
                p: { md: 3 },
              }}
            >
              <Paper {...props}>{props.children}</Paper>
            </Box>
          )}
        >
          {renderContent}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
