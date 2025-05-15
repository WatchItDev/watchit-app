export interface HandleActionErrorProps extends Error{
  requestedAmount?: {
    asset?: { symbol: string };
    toSignificantDigits: (digits: number) => string;
  };
}

export interface ActivateSubscriptionProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
