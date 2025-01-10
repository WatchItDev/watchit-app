import Stack from "@mui/material/Stack";
import {Box} from "@mui/system";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const FinanceMetamaskHelper = () => {

  const handleDownloadMetaMask = () => {
    window.location.href = 'https://metamask.app.link';
  }

  return (
    <Stack sx={{
      borderRadius: 1,
      border: '1px solid rgba(145, 158, 171, 0.32)',
      margin: '0 1em 1em 1em',
    }}>
      <Box justifyContent={'space-between'} sx={{
        justifyContent: 'space-between',
        flexDirection: 'column',
        textAlign: 'center',
        display:'flex',
        p: 2,
        borderRadius: 1 }}>
        <Typography variant={'h4'} color={'text.secondary'}>MetaMask Wallet Required</Typography>
        <Typography sx={{mt:1}} variant={'body2'} color={'text.secondary'}>
          To use this feature, you need to have the MetaMask wallet installed.
          If you don't have it, you can download it from the official website.
        </Typography>

        <Button onClick={handleDownloadMetaMask} sx={{marginTop: 2, width:'auto',}} variant={'contained'} color={'primary'}>
          Download MetaMask
        </Button>
      </Box>
    </Stack>
  )
}

export default FinanceMetamaskHelper;
