import React from 'react';
import Stack from '@mui/material/Stack';
import FinanceQuickTransfer from '@src/sections/finance/components/finance-quick-transfer';
import FinanceContacts from '@src/sections/finance/components/finance-contacts';
import FinanceEarnTokens from '@src/sections/finance/components/finance-earn-tokens';
import FinanceInviteFriends from '@src/sections/finance/components/finance-invite-friends';
import { RightSidebarProps } from '@src/sections/finance/types.ts';
import { useResponsive } from '@src/hooks/use-responsive.ts';

export const FinanceRightColumnContent: React.FC<RightSidebarProps> = (
  props,
) => {
  const { following, loadingProfiles } = props;
  const lgUp = useResponsive('up', 'lg');

  return (
    <Stack spacing={2}>
      <FinanceQuickTransfer
        loading={loadingProfiles}
        list={following}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      />
      {following?.length && lgUp ? (
        <FinanceContacts
          title="Contacts"
          chunkSize={2}
          subheader={`You have ${following.length ?? 0} contacts`}
          list={following}
        />
      ) : null}
      {!lgUp && <FinanceEarnTokens lgUp={lgUp} />}
      <FinanceInviteFriends
        price="50"
        title="Refer and Earn!"
        description="Get 50 MMC for every friend who signs up using your referral link."
        img="/assets/illustrations/characters/character_11.png"
      />
    </Stack>
  );
};
