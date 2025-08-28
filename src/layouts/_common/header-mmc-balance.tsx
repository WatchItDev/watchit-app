import HeaderBalance from '@src/layouts/_common/header-balance.tsx';
import { useGetBalance } from '@src/hooks/protocol/use-get-balance';
import mmcTokenIcon from '@src/assets/mmc_token.ico';

export default function HeaderMmcBalance() {
  const { balance } = useGetBalance();
  
  return (
    <HeaderBalance
      iconSrc={mmcTokenIcon}
      iconAlt="MMC Token"
      iconTooltip="Native currency"
      balance={balance}
      balanceTooltip="MMC tokens balance"
    />
  );
}
