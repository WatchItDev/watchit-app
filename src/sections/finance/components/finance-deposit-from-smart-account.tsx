import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const FinanceDepositFromSmartAccount = () => {
  const totalOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedTotal = new Intl.NumberFormat('en-US', totalOptions).format(500);
  return (
    <Stack direction={'column'}>
      <Box>Balance</Box>
      <Box sx={{ typography: 'h3' }}>{formattedTotal}</Box>
      <Box sx={{ typography: 'h6', opacity: 0.5, ml: 1, mb: 0.6 }}>MMC</Box>
    </Stack>
  );
}

export default FinanceDepositFromSmartAccount;
