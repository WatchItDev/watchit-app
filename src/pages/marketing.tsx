import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import Header from "@src/layouts/dashboard/header.tsx";
import HeaderContent from "@src/layouts/dashboard/header-content.tsx";
import {WithAuth} from "@src/components/should-login/withAuth.tsx";
import MarketingView from "@src/sections/marketing/views/marketing-view.tsx";

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <OgMetaTags
      title="Watchit: Marketing"
      description="Promote your content, engage audiences, and maximize visibility on Watchit."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/marketing/`}
    >
      <Header>
        <HeaderContent title="Marketing" />
      </Header>
      <WithAuth
        component={MarketingView}
        header={'Marketing Dashboard'}
        description={'Login to access your marketing overview.'}
        icon={'iconoir:megaphone'} />
    </OgMetaTags>
  );
}
