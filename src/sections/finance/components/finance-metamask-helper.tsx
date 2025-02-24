import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

const FinanceMetamaskHelper = () => {
  const handleDownloadMetaMask = () => {
    window.location.href = 'https://metamask.app.link'
  }

  return (
    <Stack sx={{ m: 2, mt: 0 }}>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        MetaMask required.{" "}
        <Link
          href="https://metamask.app.link"
          onClick={handleDownloadMetaMask}
          underline="hover"
          target="_blank"
          rel="noopener"
          sx={{ color: 'text.primary' }}
        >
          Click here
        </Link>{" "}
        if you don't have it installed.
      </Typography>
    </Stack>
  )
}

export default FinanceMetamaskHelper
