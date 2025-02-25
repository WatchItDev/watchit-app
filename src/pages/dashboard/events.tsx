// sections
import ComingSoonView from "@src/sections/coming-soon/view.tsx";
import BlankView from "@src/sections/blank/view.tsx";
import {GLOBAL_CONSTANTS} from "@src/config-global.ts";
import {OgMetaTags} from "@src/components/og-meta-tags.tsx";

// ----------------------------------------------------------------------

export default function CalendarPage() {
  return (
    <OgMetaTags
      title="Watchit: Events (COMING SOON)"
      description="Discover live streams, premieres, and community gatherings happening on Watchit."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/events/`}>
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
