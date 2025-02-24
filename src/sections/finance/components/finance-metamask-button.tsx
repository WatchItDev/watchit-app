import { FC } from 'react'
import Button from '@mui/material/Button'
import Iconify from '@src/components/iconify'

const FinanceMetamaskButton: FC<{ connect: () => void }> = ({ connect }) => {
  return <Button
    sx={{ m: 2, p: 1.5 }}
    startIcon={<Iconify icon="logos:metamask-icon" />}
    variant="outlined"
    onClick={connect}
  >
    Connect MetaMask
  </Button>
}

export default FinanceMetamaskButton
