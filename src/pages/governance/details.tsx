// sections
import { GovernanceDetailsView } from '../../sections/governance';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  // const params = useParams();
  //
  // const { id } = params;

  return (
    <OgMetaTags
      title="Watchit: Governance (COMING SOON)"
      description="Discover the latest decentralized creations on Watchit. Powered by Web3 & AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/governance`}
    >
      <GovernanceDetailsView />
    </OgMetaTags>
  )
}
