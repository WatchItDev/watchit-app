import HeaderBalance from '@src/layouts/_common/header-balance.tsx';
import { useAuth } from '@src/hooks/use-auth';
import xpBadgeIcon from '@src/assets/xp_badge.ico';

export default function HeaderXpBalance() {
  const { session } = useAuth();
  return (
    <HeaderBalance
      iconSrc={xpBadgeIcon}
      iconAlt="Xp badge"
      iconTooltip="You can redeem XP for MMC!"
      balance={session?.user?.xpBalance ?? 0}
      balanceTooltip="XP balance"
    />
  );
}
