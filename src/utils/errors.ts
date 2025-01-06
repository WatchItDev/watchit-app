/**
 * Enum of our known error names.
 */
export enum ERRORS {
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',
  BUNDLER_UNAVAILABLE = 'BUNDLER_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  METAMASK_CONNECTING_ERROR = 'METAMASK_CONNECTING_ERROR',
  WITHDRAW_FAILED_ERROR = 'WITHDRAW_FAILED_ERROR',
  DEPOSIT_ERROR = 'DEPOSIT_ERROR',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.NOT_LOGGED_IN]: 'Please log in to continue.',
  [ERRORS.BUNDLER_UNAVAILABLE]: 'The bundler is currently unavailable.',
  [ERRORS.UNKNOWN_ERROR]: 'An unknown error has occurred.',
  [ERRORS.METAMASK_CONNECTING_ERROR]: 'Error connecting to MetaMask.',
  [ERRORS.WITHDRAW_FAILED_ERROR]: 'Error while trying the withdrawals.',
  [ERRORS.DEPOSIT_ERROR]: 'Error while trying to complete the deposit.',
};
