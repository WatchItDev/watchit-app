// sections
import { PublicationCreateView } from '@src/sections/publication/view';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function MovieCreatePage() {
  return (
    <OgMetaTags
      title="Watchit: Create New Content"
      description="Unleash your creativity in Watchit Studio. Share your next big idea with powerful tools for metadata, subtitles, and more."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/publication/new`}
    >
      <PublicationCreateView />
    </OgMetaTags>
  );
}
