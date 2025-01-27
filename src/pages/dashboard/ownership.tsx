// sections
import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  return (
    <OgMetaTags
      title="Watchit: Ownership (COMING SOON)"
      description="Manage digital rights, track licensing, and unlock the power of decentralized ownership."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/ownership/`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
