// REACT IMPORTS
import { FC } from "react";

// LOCAL IMPORTS
import { useMetaMask } from "@src/hooks/use-metamask";
import FinanceWithdraw from "@src/sections/finance/components/finance-withdraw";
import FinanceMetamaskLoader from "@src/sections/finance/components/finance-metamask-loader.tsx";
import FinanceMetamaskButton from "@src/sections/finance/components/finance-metamask-button.tsx";
import { useWithdraw } from "@src/hooks/protocol/use-withdraw.ts";
import FinanceMetamaskHelper from "@src/sections/finance/components/finance-metamask-helper.tsx";

interface FinanceWithdrawFromMetamaskProps {
  onClose: () => void;
}

const FinanceWithdrawFromMetamask: FC<FinanceWithdrawFromMetamaskProps> = ({ onClose }) => {
  const withdrawHook = useWithdraw();
  const { account: address, loading, connect } = useMetaMask();

  if (loading) return <FinanceMetamaskLoader />;
  if (!address)
    return (
      <>
        <FinanceMetamaskButton connect={connect} />
        <FinanceMetamaskHelper />
      </>
    );

  return <FinanceWithdraw address={address} withdrawHook={withdrawHook} onClose={onClose} />;
};

export default FinanceWithdrawFromMetamask;
