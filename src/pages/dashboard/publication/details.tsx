// routes
import { useParams, useRouter } from '@src/routes/hooks';
// sections
import { PublicationDetailsView } from '@src/sections/publication/view';
import Header from '@src/layouts/dashboard/header.tsx';
import { paths } from '@src/routes/paths.ts';

import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const handleBack = () => {
    router.push(paths.dashboard.root);
  };

  return (
    <OgMetaTags
      title="Watchit: Discover Unique Publications"
      description="Dive into the details of exciting publications. Experience cutting-edge content and support creators on Watchit, powered by Web3 and AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/publication/${id}`}
    >
      <Header>
        <HeaderContent handleBack={handleBack} title="Movie details" />
      </Header>

      <PublicationDetailsView id={`${id}`} />
    </OgMetaTags>
  );
}
