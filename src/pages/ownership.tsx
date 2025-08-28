import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { OwnershipView } from '@src/sections/ownership/index';
import { WithAuth } from '@src/components/should-login/withAuth.tsx';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  return (
    <OgMetaTags
      title="Watchit: Ownership (COMING SOON)"
      description="Manage digital rights, track licensing, and unlock the power of decentralized ownership."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/ownership/`}
    >
      <Header>
        <HeaderContent title="Ownership" />
      </Header>
      <WithAuth
        component={OwnershipView}
        description={'Login to collect your IP.'}
        icon={'iconoir:stats-report'}
        header={'Ownership'}
      />
    </OgMetaTags>
  );
}
