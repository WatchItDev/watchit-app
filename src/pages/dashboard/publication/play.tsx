// sections
import { PublicationPlayView } from '@src/sections/publication/view';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { useParams } from '@src/routes/hooks';

// ----------------------------------------------------------------------

export default function MovieCreatePage() {
  const params = useParams();
  const { id } = params;

  return (
    <OgMetaTags
      title="Watchit: Stream Exclusive Content"
      description="Enjoy decentralized streaming experiences on Watchit. Watch exclusive content and explore the future of video powered by Web3 and AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/publication/play/${id}`}
    >
      <PublicationPlayView  publication={undefined} loading={false} />
    </OgMetaTags>
  );
}
