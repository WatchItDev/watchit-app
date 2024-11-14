import { Helmet } from 'react-helmet-async';
import { ExploreView } from '@src/sections/explore';
import { useReadContract } from 'wagmi'
import SubscriptionPolicyAbi from '@src/config/abi/SubscriptionPolicy.json';
import RightsAccessAgreementAbi from '@src/config/abi/RightsAccessAgreement.json';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const RightAccessAgreementContractAddress = '0xf1a0b26e8c66b8f1eb7fb48c079f464e3b04ebaf'
// const subscriptionPolicyContractAddress = '0x9b6f4b34ce359ddf79dd63608979d02849c1876a'
const geoAddress = '0xEFBBD14082cF2FbCf5Badc7ee619F0f4e36D0A5B'

export default function OverviewAppPage() {
  const { selectedProfile } = useAuth();

  // Check if has access
  // const result = useReadContract({
  //   abi: SubscriptionPolicyAbi.abi,
  //   address: subscriptionPolicyContractAddress,
  //   functionName: 'isAccessAllowed',
  //   args: [selectedProfile?.ownedBy?.address, 0],
  // })

  // Get subscribe policy pricing
  // const result = useReadContract({
  //   abi: SubscriptionPolicyAbi.abi,
  //   address: subscriptionPolicyContractAddress,
  //   functionName: 'resolveTerms',
  //   args: [geoAddress], // in this case we get geo subscribe policy pricing
  // })

  // Create a right access agreement
  const result = useReadContract({
    abi: RightsAccessAgreementAbi.abi,
    address: RightAccessAgreementContractAddress,
    functionName: 'resolveTerms',
    args: [geoAddress],
  })

  useEffect(() => {
    console.log('result')
    console.log(result)
  }, [result]);

  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <ExploreView />
    </>
  );
}
