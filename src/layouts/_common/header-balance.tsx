import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import { formatBalanceNumber } from '@src/utils/format-number';

interface HeaderBalanceProps {
  iconSrc: string;
  iconAlt: string;
  iconTooltip: string;
  balance: number;
  balanceTooltip: string;
}

const HeaderBalance: React.FC<HeaderBalanceProps> = ({
                                                       iconSrc,
                                                       iconAlt,
                                                       iconTooltip,
                                                       balance,
                                                       balanceTooltip,
                                                     }) => {
  const router = useRouter();

  const handleGoFinance = () => {
    router.push(paths.dashboard.finance);
  };

  return (
    <Button
      variant="text"
      sx={{ px: 1.5, py: 1, mr: -0.75 }}
      onClick={handleGoFinance}
    >
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Box
          sx={{
            width: 20,
            height: 20,
            mr: 1,
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tooltip title={iconTooltip}>
            <img
              src={iconSrc}
              alt={iconAlt}
              style={{ width: 230, height: 20, borderRadius: '0.65rem' }}
            />
          </Tooltip>
        </Box>
        <Tooltip title={balanceTooltip}>
          <Typography variant="subtitle2" sx={{ textAlign: 'left' }} noWrap>
            {formatBalanceNumber(balance)}
          </Typography>
        </Tooltip>
      </Stack>
    </Button>
  );
};

export default HeaderBalance;
