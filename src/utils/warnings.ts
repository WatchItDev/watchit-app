/**
 * Enum of our known error names.
 */
export enum WARNING {
  NO_WALLET_AUTHORIZATION = 'NO_WALLET_AUTHORIZATION',
  NO_WALLET_CONNECTED = 'NO_WALLET_CONNECTED',
  INVALID_DEPOSIT_AMOUNT = 'INVALID_DEPOSIT_AMOUNT',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const WARNING_MESSAGES: Record<WARNING, string> = {
  [WARNING.NO_WALLET_AUTHORIZATION]: 'No wallet authorization received.',
  [WARNING.NO_WALLET_CONNECTED]: 'No wallet connected.',
  [WARNING.INVALID_DEPOSIT_AMOUNT]: 'Invalid deposit amount.',
};
