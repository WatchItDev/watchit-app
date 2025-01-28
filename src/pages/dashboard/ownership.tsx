// sections
import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import Ownership from '@src/sections/ownership';
import { canViewSection } from '@src/pages/dashboard/studio.tsx';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  const sessionData = useSelector((state: any) => state.auth.session);

  return (
    <OgMetaTags
      title="Watchit: Ownership (COMING SOON)"
      description="Manage digital rights, track licensing, and unlock the power of decentralized ownership."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/ownership/`}
    >
      {canViewSection(sessionData) ? (
        <>
          <Header>
            <HeaderContent title="Ownership" />
          </Header>
          <Ownership />
        </>
      ) : (
        <BlankView>
          <ComingSoonView
            deadline={'03/30/2025 21:30'}
            showDeadline={true}
            content={
              "The Ownership is evolving! Soon, you'll gManage digital rights, track licensing, and unlock the power of decentralized ownership. Stay tuned!"
            }
          />
        </BlankView>
      )}
    </OgMetaTags>
  );
}
