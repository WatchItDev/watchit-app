import { Helmet } from 'react-helmet-async';
import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';
import {useSelector} from "react-redux";
import {canViewSection} from "@src/pages/dashboard/studio.tsx";
import Header from "@src/layouts/dashboard/header.tsx";
import HeaderContent from "@src/layouts/dashboard/header-content.tsx";
import MarketingView from "@src/sections/marketing";
// ----------------------------------------------------------------------

export default function ChatPage() {
  const sessionData = useSelector((state: any) => state.auth.session);
  return (
    <>
      <Helmet>
        <title> WatchIt | Marketing</title>
      </Helmet>

      {
        canViewSection(sessionData) ? (<><Header>
          <HeaderContent title="Marketing" />
        </Header>
          <MarketingView />
        </>) : (<>
          <BlankView>
            <ComingSoonView />
          </BlankView>
        </>)
      }
    </>
  );
}
