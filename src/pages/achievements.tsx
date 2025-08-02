// sections
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { WithAuth } from '@src/components/should-login/withAuth.tsx';
import AchievementsView from '@src/sections/achievements/views/achievements-view.tsx';

// ----------------------------------------------------------------------

export default function BlankPage() {
  return (
    <OgMetaTags
      title="Watchit: Achievements (COMING SOON)"
      description="Track and celebrate user milestones, badges, and accomplishments across the Watchit platform."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/achievements/`}
    >
      <Header>
        <HeaderContent title="Achievements" />
      </Header>
      <WithAuth component={AchievementsView} description={'Login to access your achievements.'} icon={'iconoir:stats-report'} header={'Achievements section'} />
    </OgMetaTags>
  );
}
