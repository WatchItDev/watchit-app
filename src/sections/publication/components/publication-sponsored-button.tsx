import { FC } from 'react';
import { SponsoredAccessTrialButton } from '@src/components/sponsored-access-button';
import { PublicationSponsoredButtonProps } from '@src/sections/publication/types.ts';

export const PublicationSponsoredButton: FC<PublicationSponsoredButtonProps> = (props) => {
  const {
    isActive,
    publication,
    campaign,
    onSponsorSuccess,
  } = props;

  return (
    <SponsoredAccessTrialButton
      isActive={isActive}
      holderAddress={publication?.by?.ownedBy?.address}
      campaignAddress={campaign}
      onSuccess={onSponsorSuccess}
      neonPaperProps={{
        height: '35px',
        bottom: 16,
        left: 16,
        position: 'absolute',
        zIndex: 2,
        sx: {
          height: '36px',
          bottom: 16,
          left: 16,
          position: 'absolute',
          zIndex: 2,
        },
      }}
    />
  );
};
