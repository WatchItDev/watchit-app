import { FC } from 'react'
import { Box } from '@mui/system'
import { LoadingScreen } from '@src/components/loading-screen'

const FinanceMetamaskLoader: FC = () => {
  return <Box sx={{ mx: 4, my: 8 }}>
    <LoadingScreen />
  </Box>
}

export default FinanceMetamaskLoader
