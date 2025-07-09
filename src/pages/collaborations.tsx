// sections
import BlankView from '@src/sections/blank/views/blank-view.tsx';
import { ComingSoonView } from '../sections/coming-soon';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function BlankPage() {
  return (
    <OgMetaTags
      title="Watchit: Collaborations (COMING SOON)"
      description="Connect, co-create, and share projects with other content creators on Watchit."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/collaborations/`}
    >
      <BlankView>
        <ComingSoonView
          title={"Collaborations (Coming soon)"}
          content={
            "Watchit collaborations are coming soon! Connect, co-create, and share projects with fellow creators. Stay tuned!"
          }
        />
      </BlankView>
    </OgMetaTags>
  );
}
