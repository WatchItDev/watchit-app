// src/sections/finance/components/FinanceWithdrawModal.tsx

import { FC } from "react";

// LOCAL IMPORTS
import Iconify from "@src/components/iconify";
import FinanceModal from "@src/sections/finance/components/finance-modal";
import FinanceWithdrawFromMetamask from "@src/sections/finance/components/finance-withdraw-from-metamask";
import FinanceWithdrawFromSmartAccount from "@src/sections/finance/components/finance-withdraw-from-smart-account";

interface FinanceWithdrawModalProps {
  open: boolean;
  onClose: VoidFunction;
}

const withdrawTabs = [
  {
    value: "metamask",
    label: "Metamask",
    disabled: false,
    icon: <Iconify icon={"logos:metamask-icon"} />,
  },
  {
    value: "smartAccount",
    label: "Smart Account",
    disabled: false,
    icon: <Iconify icon={"logos:ethereum-color"} />,
  },
];

export const FinanceWithdrawModal: FC<FinanceWithdrawModalProps> = ({ open, onClose }) => {
  const renderContent = (currentTab: string) => {
    switch (currentTab) {
      case "metamask":
        return <FinanceWithdrawFromMetamask onClose={onClose} />;
      case "smartAccount":
        return <FinanceWithdrawFromSmartAccount onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <FinanceModal
      data-testid="finance-withdraw-modal"
      open={open}
      onClose={onClose}
      title="Withdraw to"
      tabs={withdrawTabs}
      renderContent={renderContent}
      maxWidth="xs"
      fullWidth
    />
  );
};

export default FinanceWithdrawModal;
