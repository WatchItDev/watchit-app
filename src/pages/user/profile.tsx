// LOCAL IMPORTS
import { UserProfileView } from '../../sections/user';
import { useParams, useRouter } from '@src/routes/hooks';
import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { paths } from '@src/routes/paths.ts';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const handleBack = () => {
    router.push(paths.dashboard.root);
  };

  return (
    <OgMetaTags
      title="Watchit: Explore Profiles"
      description="Discover creators and their contributions on Watchit. Connect, explore, and support their journey in decentralized content powered by Web3 and AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/profile/${id}`}
    >
      <Header>
        <HeaderContent handleBack={handleBack} title="Profile" />
      </Header>

      <UserProfileView id={id as string} />
    </OgMetaTags>
  );
}
