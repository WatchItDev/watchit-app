import { OgMetaTags } from '@src/components/og-meta-tags.tsx'
import { GLOBAL_CONSTANTS } from '@src/config-global.ts'
import { GovernanceCreateView } from '@src/sections/governance/view'

export default function UserCreatePage() {
  return (
    <OgMetaTags
      title="Watchit: Governance (COMING SOON)"
      description="Discover the latest decentralized creations on Watchit. Powered by Web3 & AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/governance`}
    >
      <GovernanceCreateView />
    </OgMetaTags>
  )
}
