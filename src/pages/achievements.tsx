// sections
import BlankView from '@src/sections/blank/views/blank-view.tsx';
import { ComingSoonView } from '../sections/coming-soon';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function BlankPage() {
  return (
    <OgMetaTags
      title="Watchit: Achievements (COMING SOON)"
      description="Track and celebrate user milestones, badges, and accomplishments across the Watchit platform."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/achievements/`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
