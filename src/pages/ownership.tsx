import BlankView from '@src/sections/blank/views/blank-view.tsx';
import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { ComingSoonView } from '@src/sections/coming-soon';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { OwnershipView } from '@src/sections/ownership/index';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useIsVerified } from '@src/hooks/protocol/use-is-verified.ts';
import { Address } from 'viem';
import { LoadingScreen } from '@src/components/loading-screen';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  const { session: sessionData, isAuthLoading } = useAuth();
  const { isVerified, loading } = useIsVerified(sessionData?.address as Address);

  if ((loading && sessionData.authenticated) || isAuthLoading) return <LoadingScreen />;

  return (
    <OgMetaTags
      title="Watchit: Ownership (COMING SOON)"
      description="Manage digital rights, track licensing, and unlock the power of decentralized ownership."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/ownership/`}
    >
      {isVerified && sessionData.address ? (
        <>
          <Header>
            <HeaderContent title="Ownership" />
          </Header>
          <OwnershipView />
        </>
      ) : (
        <BlankView>
          <ComingSoonView
            content={
              "The Ownership is evolving! Soon, you'll gManage digital rights, track licensing, and unlock the power of decentralized ownership. Stay tuned!"
            }
          />
        </BlankView>
      )}
    </OgMetaTags>
  );
}
