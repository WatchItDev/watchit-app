import { FC } from "react";

import FinanceWithdraw from "@src/sections/finance/components/finance-withdraw.tsx";
import { useAuth } from "@src/hooks/use-auth.ts";
import { useWithdraw } from "@src/hooks/protocol/use-withdraw.ts";

interface FinanceWithdrawFromSmartAccountProps {
  onClose: () => void;
}

const FinanceWithdrawFromSmartAccount: FC<FinanceWithdrawFromSmartAccountProps> = ({ onClose }) => {
  const { session: sessionData } = useAuth();
  const userAddress = sessionData?.address;
  const withdrawHook = useWithdraw();

  return <FinanceWithdraw address={userAddress} withdrawHook={withdrawHook} onClose={onClose} />;
};

export default FinanceWithdrawFromSmartAccount;
