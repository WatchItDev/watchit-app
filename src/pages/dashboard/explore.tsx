import { Helmet } from 'react-helmet-async';
import { ExploreView } from '@src/sections/explore';
// import { useReadContract, useWatchContractEvent, useWriteContract, usePublicClient } from 'wagmi';
// import { Contract, Interface, ethers } from 'ethers';
// import SubscriptionPolicyAbi from '@src/config/abi/SubscriptionPolicy.json';
// import RightsAccessAgreementAbi from '@src/config/abi/RightsAccessAgreement.json';
// import MMCAbi from '@src/config/abi/MMC.json';
// import { useAuth } from '@src/hooks/use-auth.ts';
import { useEffect } from 'react';
// import { useContract } from '@thirdweb-dev/react';
// import { useEthersProvider } from '@src/hooks/use-ethers-provider.ts';

// ----------------------------------------------------------------------

// const RightAccessAgreementContractAddress = '0xec5046e12f2f0b566955e575a9172070ac2d2f44'
// const RightPolicyManagerContractAddress = '0xe77402d7e84f2d3167cab6379b7db14d3dd148aa'
// const SubscriptionPolicyContractAddress = '0xcafde3bc71b7ab469c8b165e896547d5868e9e5c'
// const GeoAddress = '0xEFBBD14082cF2FbCf5Badc7ee619F0f4e36D0A5B'
// const JacobAddress = '0x037f2b49721E34296fBD8F9E7e9cc6D5F9ecE7b4'
// const CarlosAddress = '0x0a97e1D4F456306f3a40cf075bcdaCdA3136F3d1'
// const MMCAddress = '0xbd4f590d228bb3a745ec5feb049ddf6eda82eb20'
// const AgreementProof = '67053297424106297666457043744656533882204336094324141282694099759098542619962'

export default function OverviewAppPage() {
  // const { selectedProfile } = useAuth();
  // const ethersProvider = useEthersProvider();

  // Check if has access
  // const result = useReadContract({
  //   abi: SubscriptionPolicyAbi.abi,
  //   address: SubscriptionPolicyContractAddress,
  //   functionName: 'isAccessAllowed',
  //   args: [GeoAddress, selectedProfile?.ownedBy?.address], // first address is the address owner and the second one is the address who is asking if has access
  // })

  // Get subscribe policy pricing
  // const result = useReadContract({
  //   abi: SubscriptionPolicyAbi.abi,
  //   address: SubscriptionPolicyContractAddress,
  //   functionName: 'resolveTerms',
  //   args: [GeoAddress], // in this case we get geo subscribe policy pricing
  // })

  // Create a right access agreement
  // const { writeContractAsync } = useWriteContract()

  // useEffect(() => {
  //   console.log('result')
  //   console.log(result)
  // }, [result]);

  // const createAgreement = async () => {
  //   console.log('hello create agreement')
  //   const amount = '10' // MMC
  //   const amountInWei = ethers.parseUnits(amount, 18);
  //   const response = await writeContractAsync({
  //     abi: RightsAccessAgreementAbi.abi,
  //     address: RightAccessAgreementContractAddress,
  //     functionName: 'createAgreement',
  //     args: [
  //       amountInWei,
  //       MMCAddress,
  //       RightPolicyManagerContractAddress,
  //       [JacobAddress, CarlosAddress], // parties
  //       '0x'
  //     ],
  //   })
  //
  //   console.log('hello contract res')
  //   console.log(response)
  // }
  //
  // const approveAmount = async () => {
  //   console.log('hello approve mmc')
  //   const amount = '10' // MMC
  //   const amountInWei = ethers.parseUnits(amount, 18);
  //   const response = await writeContractAsync({
  //     abi: MMCAbi.abi,
  //     address: MMCAddress,
  //     functionName: 'approve',
  //     args: [
  //       RightAccessAgreementContractAddress,
  //       amountInWei,
  //     ],
  //   })
  //
  //   console.log('hello approve res')
  //   console.log(response)
  // }

  // useWatchContractEvent({
  //   address: RightAccessAgreementContractAddress,
  //   abi: RightsAccessAgreementAbi.abi,
  //   eventName: 'AgreementCreated',
  //   onLogs(logs) {
  //     console.log('New agreement created!')
  //     console.log(logs)
  //   },
  // })

  // const fetchEventHistory = async () => {
  //   // Contract address and ABI
  //   const contractAddress = 'RightAccessAgreementContractAddress';
  //   const contractABI = RightsAccessAgreementAbi.abi;
  //   const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology/');
  //
  //   // Create a contract instance
  //   const contract = new Contract(contractAddress, contractABI, provider);
  //
  //   // Name of the event you want to fetch
  //   const eventName = 'AgreementCreated';
  //
  //   // Create a filter for the event
  //   const eventFilter = contract.filters[eventName]();
  //
  //   // Fetch past event logs
  //   const logs = await contract.queryFilter(eventFilter);
  //
  //   // Create an interface to decode the logs
  //   const iface = new Interface(contractABI);
  //   const decodedEvents = logs.map(log => iface.parseLog(log));
  //
  //   console.log('decoded events')
  //   console.log(decodedEvents)
  //
  //   // Return the decoded events
  //   return decodedEvents;
  // };


  // const registerSubscription = async () => {
  //   console.log('hello register subscription')
  //   const amount = '10' // MMC
  //   const amountInWei = ethers.parseUnits(amount, 18);
  //   const response = await writeContractAsync({
  //     abi: RightsAccessAgreementAbi.abi,
  //     address: RightAccessAgreementContractAddress,
  //     functionName: 'createAgreement',
  //     args: [
  //       amountInWei,
  //       MMCAddress,
  //       RightPolicyManagerContractAddress,
  //       [JacobAddress, CarlosAddress], // parties
  //       '0x'
  //     ],
  //   })
  //
  //   console.log('hello register subscription res')
  //   console.log(response)
  // }

  // useEffect(() => {
  //   (async () => {
  //     // await approveAmount()
  //     // await createAgreement()
  //
  //     // fetchEventHistory()
  //   })()
  // }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <ExploreView />
    </>
  );
}
