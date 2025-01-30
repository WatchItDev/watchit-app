import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <OgMetaTags
      title="Watchit: Marketing (COMING SOON)"
      description="Promote your content, engage audiences, and maximize visibility with AI-powered marketing tools. Stay tuned!"
      url={`${GLOBAL_CONSTANTS.BASE_URL}/marketing/`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
