import { Helmet } from 'react-helmet-async';
import { ExploreView } from '@src/sections/explore';
import HeaderContent from "@src/layouts/dashboard/HeaderContent.tsx";
// import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
// import { useEffect } from 'react';
// import { createWalletClient, custom, hashMessage } from 'viem';
// import { HttpChain, HttpChainClient, fetchBeacon } from "drand-client";
import Header from '@src/layouts/dashboard/header.tsx';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  // const { web3AuthInstance } = useWeb3Auth();
  //
  // useEffect(() => {
  //   console.log('Web3auth instance', web3AuthInstance);
  //
  //   (async () => {
  //     console.log('hello provider!');
  //     console.log(web3AuthInstance.provider);
  //
  //     const client = createWalletClient({
  //       transport: custom(web3AuthInstance.provider)
  //     })
  //
  //     console.log('hello client!');
  //     console.log(client);
  //     const options = {
  //       disableBeaconVerification: true,
  //       noCache: false, // true disables caching when retrieving beacons for some providers
  //     }
  //     const chain = new HttpChain("https://api.drand.sh/");
  //     const clientDrant = new HttpChainClient(chain, options);
  //     const beacon = await fetchBeacon(clientDrant)
  //     const assetId = 'bafkreiespj2h4qxgyzj2j5fstd6w4xvdpdx63ctl5h2q2tuizmghp33k5u'
  //     const hashMsg = hashMessage(`${assetId}:${beacon.randomness}`)
  //     const message = `${assetId}:80002:${beacon.randomness}`
  //
  //     console.log('hashMsg', hashMsg);
  //     console.log('chain', chain);
  //     console.log('clientDrant', clientDrant);
  //     console.log('beacon', beacon);
  //     console.log('message', message);
  //
  //     const addresses = await client?.getAddresses();
  //     console.log('address', addresses);
  //     const sign = await client.signMessage({ account: addresses[1], message: message });
  //     console.log('sign', sign);
  //
  //     const API_URL = `https://dbac-2803-2d60-1106-c35-4c2e-8ca4-13ee-97f4.ngrok-free.app/auth?signature=${sign}&assetId=${assetId}`;
  //
  //     console.log('api url', API_URL);
  //
  //     try {
  //       const response = await fetch(API_URL, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'signature': sign,
  //         }
  //       });
  //
  //
  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log('Response data:', data);
  //       } else {
  //         console.error('Error in request:', response.status, response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Request failed:', error);
  //     }
  //   })()
  // }, [web3AuthInstance, web3AuthInstance.provider]);

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
