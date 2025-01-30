import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';
// import {useSelector} from "react-redux";
// import {canViewSection} from "@src/pages/dashboard/ownership.tsx";
// import Header from "@src/layouts/dashboard/header.tsx";
// import HeaderContent from "@src/layouts/dashboard/header-content.tsx";
// import MarketingView from "@src/sections/marketing";
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function ChatPage() {
  // const sessionData = useSelector((state: any) => state.auth.session);
  return (
    <OgMetaTags
      title="Watchit: Marketing (COMING SOON)"
      description="Promote your content, engage audiences, and maximize visibility with AI-powered marketing tools. Stay tuned!"
      url={`${GLOBAL_CONSTANTS.BASE_URL}/marketing/`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>

      {/*{*/}
      {/*  canViewSection(sessionData) ? (<><Header>*/}
      {/*    <HeaderContent title="Marketing" />*/}
      {/*  </Header>*/}
      {/*    <MarketingView />*/}
      {/*  </>) : (<>*/}
      {/*    <BlankView>*/}
      {/*      <ComingSoonView />*/}
      {/*    </BlankView>*/}
      {/*  </>)*/}
      {/*}*/}
    </OgMetaTags>
  );
}
