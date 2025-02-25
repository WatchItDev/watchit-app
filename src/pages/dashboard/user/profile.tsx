// LOCAL IMPORTS
import {UserProfileView} from "@src/sections/user/view";
import {useParams} from "@src/routes/hooks";
import Header from "@src/layouts/dashboard/header.tsx";
import HeaderContent from "@src/layouts/dashboard/header-content.tsx";
import {GLOBAL_CONSTANTS} from "@src/config-global.ts";
import {OgMetaTags} from "@src/components/og-meta-tags.tsx";

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const params = useParams();
  const {id} = params;

  return (
    <OgMetaTags
      title="Watchit: Explore Profiles"
      description="Discover creators and their contributions on Watchit. Connect, explore, and support their journey in decentralized content powered by Web3 and AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/profile/${id}`}>
      <Header>
        <HeaderContent title="Profile" />
      </Header>

      <UserProfileView id={id} />
    </OgMetaTags>
  );
}
