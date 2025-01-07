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
  INVITATION_EMAIL_ERROR = 'INVITATION_EMAIL_ERROR',
  LINK_COPIED_ERROR = 'LINK_COPIED_ERROR',
  FAILED_CHANGE_WALLET_ERROR = 'FAILED_CHANGE_WALLET_ERROR',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.NOT_LOGGED_IN]: 'Please log in to continue.',
  [ERRORS.BUNDLER_UNAVAILABLE]: 'The bundler is currently unavailable.',
  [ERRORS.UNKNOWN_ERROR]: 'An unknown error has occurred.',
  [ERRORS.METAMASK_CONNECTING_ERROR]: 'Error connecting to MetaMask.',
  [ERRORS.WITHDRAW_FAILED_ERROR]: 'Error while trying the withdrawal.',
  [ERRORS.DEPOSIT_ERROR]: 'Error while trying to complete the deposit.',
  [ERRORS.INVITATION_EMAIL_ERROR]: 'Error while trying to send the invitation email.',
  [ERRORS.LINK_COPIED_ERROR]: 'Error while trying to copy the link.',
  [ERRORS.FAILED_CHANGE_WALLET_ERROR]: 'Error while trying to change the wallet.',
};
