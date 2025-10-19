import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { BlankView } from '@src/sections/blank';

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <OgMetaTags
      title="Watchit: Marketing"
      description="Promote your content, engage audiences, and maximize visibility on Watchit."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/marketing/`}
    >
      <BlankView>
      </BlankView>
    </OgMetaTags>
  );
}
