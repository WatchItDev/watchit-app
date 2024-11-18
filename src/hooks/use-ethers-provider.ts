import { usePublicClient } from 'wagmi';
import { JsonRpcProvider } from 'ethers';

export const useEthersProvider = () => {
  const publicClient = usePublicClient();
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return new JsonRpcProvider(transport.url, network);
}
