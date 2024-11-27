import { Helmet } from 'react-helmet-async';
import { ExploreView } from '@src/sections/explore';
import Header from "@src/layouts/dashboard/header.tsx";
import HeaderContent from "@src/layouts/dashboard/HeaderContent.tsx";
// import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
// import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  // const { web3AuthInstance } = useWeb3Auth();
  //
  // const accountAbstractionProvider =
  //   web3AuthInstance?.options?.accountAbstractionProvider;
  // const smartAccount = accountAbstractionProvider?.smartAccount;
  //
  // useEffect(() => {
  //   console.log('Web3auth instance', web3AuthInstance);
  //   console.log('accountAbstractionProvider', accountAbstractionProvider);
  //   console.log('smartAccount', smartAccount);
  //
  //   if (smartAccount) {
  //     (async () => {
  //       console.log('hello smart!');
  //       const address = await smartAccount?.getAddress();
  //       console.log('address', address);
  //       const sign = await smartAccount.signMessage({ account: address, message: 'CUSTOM_MESSAGE' });
  //       console.log('sign', sign);
  //     })()
  //   }
  // }, [web3AuthInstance, accountAbstractionProvider, smartAccount, accountAbstractionProvider?.smartAccount]);

  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <Header>
        <HeaderContent title="Explore" />
      </Header>

      <ExploreView />
    </>
  );
}
