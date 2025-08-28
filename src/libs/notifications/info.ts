/**
 * Enum of our known info names.
 */
export enum INFO {
  DEFAULT = 'DEFAULT',
  WITHDRAW_WAITING_CONFIRMATION = 'WITHDRAW_WAITING_CONFIRMATION',
  WITHDRAW_SENDING_CONFIRMATION = 'WITHDRAW_SENDING_CONFIRMATION',
  APPROVE_SENDING_CONFIRMATION = 'APPROVE_SENDING_CONFIRMATION',
  APPROVE_WAITING_CONFIRMATION = 'APPROVE_WAITING_CONFIRMATION',
  DEPOSIT_SENDING_CONFIRMATION = 'DEPOSIT_SENDING_CONFIRMATION',
  DEPOSIT_WAITING_CONFIRMATION = 'DEPOSIT_WAITING_CONFIRMATION',
  REGISTER_OWNERSHIP_PROGRESS = 'REGISTER_OWNERSHIP_PROGRESS',
}

/**
 * Info messages dictionary mapping our INFO_MESSAGES to user-facing strings.
 */
export const INFO_MESSAGES: Record<INFO, string> = {
  [INFO.DEFAULT]: 'Default info message.',
  // Withdraw
  [INFO.WITHDRAW_WAITING_CONFIRMATION]:
    'Withdraw transaction broadcasted. Waiting for confirmation...',
  [INFO.WITHDRAW_SENDING_CONFIRMATION]:
    'Sending withdraw transaction to the network...',
  [INFO.DEPOSIT_SENDING_CONFIRMATION]:
    'Sending deposit transaction to the network...',
  [INFO.APPROVE_SENDING_CONFIRMATION]:
    'Sending approve transaction to the network...',
  [INFO.APPROVE_WAITING_CONFIRMATION]:
    'Approve transaction broadcasted. Waiting for confirmation (1/2)...',
  [INFO.DEPOSIT_WAITING_CONFIRMATION]:
    'Deposit transaction broadcasted. Waiting for confirmation (2/2)...',
  [INFO.REGISTER_OWNERSHIP_PROGRESS]: 'Processing asset {index} of {total}',
};
