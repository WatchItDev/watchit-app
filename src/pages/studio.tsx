import BlankView from '@src/sections/blank/views/blank-view.tsx';
import { ComingSoonView } from '@src/sections/coming-soon';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  return (
    <OgMetaTags
      title="Watchit: Studio (COMING SOON)"
      description="Explore our evolving Studio! Soon, you’ll generate fresh content and enhance your projects with AI-driven metadata, images, subtitles, voiceovers, and security checks."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/studio/`}
    >
      <BlankView>
        <ComingSoonView
          content={
            "The Studio is evolving! Soon, you'll generate new content and enhance your creations with AI-driven tools for metadata, images, subtitles, voiceovers, and security checks. Stay tuned!"
          }
        />
      </BlankView>
    </OgMetaTags>
  );
}
