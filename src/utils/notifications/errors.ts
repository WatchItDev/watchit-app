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
  UPDATING_PROFILE_ERROR = 'UPDATING_PROFILE_ERROR',
  CREATING_PROFILE_ERROR = 'CREATING_PROFILE_ERROR',
  BROADCASTING_TRANSACTION_ERROR = 'BROADCASTING_TRANSACTION_ERROR',
  PENDING_SIGNING_REQUEST_ERROR = 'PENDING_SIGNING_REQUEST_ERROR',
  INSUFFICIENT_ALLOWANCE_ERROR = 'INSUFFICIENT_ALLOWANCE_ERROR',
  INSUFFICIENT_FUNDS_ERROR = 'INSUFFICIENT_FUNDS_ERROR',
  WALLET_CONNECTION_ERROR = 'WALLET_CONNECTION_ERROR',
  PREMATURE_ACTION_ERROR = 'PREMATURE_ACTION_ERROR',

  // Login error
  LOGIN_FAILED_ERROR = 'LOGIN_FAILED_ERROR',
  FIRST_LOGIN_ERROR = 'FIRST_LOGIN_ERROR',

  // Deposit error
  DEPOSIT_FAILED_ERROR = 'DEPOSIT_FAILED_ERROR',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.NOT_LOGGED_IN]: 'Please log in to continue.',
  [ERRORS.UNKNOWN_ERROR]: 'An unknown error has occurred.',
  [ERRORS.METAMASK_CONNECTING_ERROR]: 'Error connecting to MetaMask.',
  [ERRORS.WITHDRAW_FAILED_ERROR]: 'Error while trying the withdrawal.',
  [ERRORS.DEPOSIT_ERROR]: 'Error while trying to complete the deposit.',
  [ERRORS.INVITATION_EMAIL_ERROR]: 'Error while trying to send the invitation email.',
  [ERRORS.LINK_COPIED_ERROR]: 'Error while trying to copy the link.',
  [ERRORS.FAILED_CHANGE_WALLET_ERROR]: 'Error while trying to change the wallet.',
  [ERRORS.CREATING_PROFILE_ERROR]: 'Error creating profile.',
  [ERRORS.UPDATING_PROFILE_ERROR]: 'Error updating profile metadata.',

  [ERRORS.BROADCASTING_TRANSACTION_ERROR]: 'There was an error broadcasting the transaction.',
  [ERRORS.PENDING_SIGNING_REQUEST_ERROR]: 'There is a pending signing request in your wallet.',
  [ERRORS.INSUFFICIENT_ALLOWANCE_ERROR]: 'You must approve the contract to spend at least {symbol} {amount}',
  [ERRORS.INSUFFICIENT_FUNDS_ERROR]: 'You do not have enough funds to pay for this follow fee {symbol} {amount}',
  [ERRORS.WALLET_CONNECTION_ERROR]: 'There was an error connecting to your wallet.',
  [ERRORS.PREMATURE_ACTION_ERROR]: 'There is a pending unfollow request for this profile.',

  // Login error
  [ERRORS.LOGIN_FAILED_ERROR]: 'The login process failed. Please try again later.',

  // Witdhdraw error
  [ERRORS.FIRST_LOGIN_ERROR]: 'You must login first to withdraw funds.',
  [ERRORS.BUNDLER_UNAVAILABLE]: 'Your session is expired. Please re-login to continue.',

  // Deposit error
  [ERRORS.DEPOSIT_FAILED_ERROR]: 'Please login to deposit funds.',
};
