/**
 * Enum of our known error names.
 */
export enum ERRORS {
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',
  BUNDLER_UNAVAILABLE = 'BUNDLER_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  METAMASK_CONNECTING_ERROR = 'METAMASK_CONNECTING_ERROR',
  WITHDRAW_FAILED_ERROR = 'WITHDRAW_FAILED_ERROR',
  TRANSFER_FAILED_ERROR = 'TRANSFER_FAILED_ERROR',
  ACTIVATE_SUBSCRIPTION_FAILED_ERROR = 'ACTIVATE_SUBSCRIPTION_FAILED_ERROR',
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
  ASSET_OWNERSHIP_REGISTER_ERROR = 'ASSET_OWNERSHIP_REGISTER_ERROR',

  // Login error
  LOGIN_FAILED_ERROR = 'LOGIN_FAILED_ERROR',
  FIRST_LOGIN_ERROR = 'FIRST_LOGIN_ERROR',

  // Deposit error
  DEPOSIT_FAILED_ERROR = 'DEPOSIT_FAILED_ERROR',
  DEPOSIT_WENT_WRONG_ERROR = 'DEPOSIT_WENT_WRONG_ERROR',

  // Authorization error
  AUTHORIZATION_POLICY_ERROR = 'AUTHORIZATION_POLICY_ERROR',

  // Transfer error
  TRANSFER_LOGIN_FIRST_ERROR = 'TRANSFER_LOGIN_FIRST_ERROR',

  // Subscribe error
  SUBSCRIBE_LOGIN_ERROR = 'SUBSCRIBE_LOGIN_ERROR',
  SUBSCRIBE_MINIMUN_DAYS_ERROR = 'SUBSCRIBE_MINIMUN_DAYS_ERROR',
  INSUFICIENT_BALANCE_ERROR = 'INSUFICIENT_BALANCE_ERROR',
  FAILED_JOIN_PROFILE_ERROR = 'FAILED_JOIN_PROFILE_ERROR',

  // Follow/ unfollow
  FOLLOW_UNFOLLOW_OCCURRED_ERROR = 'FOLLOW_UNFOLLOW_OCCURRED_ERROR',

  // METAMASK
  METAMASK_CONNECTING_FAILED_ERROR = 'METAMASK_CONNECTING_FAILED_ERROR',
  METAMASK_CHANGE_WALLET_ERROR = 'METAMASK_CHANGE_WALLET_ERROR',

  // REFERALS
  ALREADY_SENT_INVITATION = 'ALREADY_SENT_INVITATION',
  ALREADY_ENROLLED = 'ALREADY_ENROLLED',
  INVITATION_SEND_ERROR = 'INVITATION_SEND_ERROR',
  INVITATION_USER_ALREADY_INVITED = 'INVITATION_USER_ALREADY_INVITED',
  INVITATION_USER_CANT_INVITE_SELF = 'INVITATION_USER_CANT_INVITE_SELF',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.NOT_LOGGED_IN]: 'Please log in to continue.',
  [ERRORS.UNKNOWN_ERROR]: 'An unknown error has occurred.',
  [ERRORS.METAMASK_CONNECTING_ERROR]: 'Error connecting to MetaMask.',
  [ERRORS.WITHDRAW_FAILED_ERROR]: 'Error while trying the withdrawal.',
  [ERRORS.TRANSFER_FAILED_ERROR]: 'Error while trying to complete the transfer.',
  [ERRORS.DEPOSIT_ERROR]: 'Error while trying to complete the deposit.',
  [ERRORS.ACTIVATE_SUBSCRIPTION_FAILED_ERROR]: 'Error while trying to activate the subscription.',
  [ERRORS.INVITATION_EMAIL_ERROR]: 'Error while trying to send the invitation email.',
  [ERRORS.LINK_COPIED_ERROR]: 'Error while trying to copy the link.',
  [ERRORS.FAILED_CHANGE_WALLET_ERROR]: 'Error while trying to change the wallet.',
  [ERRORS.CREATING_PROFILE_ERROR]: 'Error creating profile.',
  [ERRORS.UPDATING_PROFILE_ERROR]: 'Error updating profile metadata.',
  [ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR]: 'An error occurred while registering your asset. Please try again.',

  [ERRORS.BROADCASTING_TRANSACTION_ERROR]: 'There was an error broadcasting the transaction.',
  [ERRORS.PENDING_SIGNING_REQUEST_ERROR]: 'There is a pending signing request in your wallet.',
  [ERRORS.INSUFFICIENT_ALLOWANCE_ERROR]:
    'You must approve the contract to spend at least {symbol} {amount}',
  [ERRORS.INSUFFICIENT_FUNDS_ERROR]:
    'You do not have enough funds to pay for this follow fee {symbol} {amount}',
  [ERRORS.WALLET_CONNECTION_ERROR]: 'There was an error connecting to your wallet.',
  [ERRORS.PREMATURE_ACTION_ERROR]: 'There is a pending unfollow request for this profile.',

  // Login error
  [ERRORS.LOGIN_FAILED_ERROR]: 'The login process failed. Please try again later.',

  // Withdraw error
  [ERRORS.FIRST_LOGIN_ERROR]: 'You must login first to withdraw funds.',
  [ERRORS.BUNDLER_UNAVAILABLE]: 'Your session is expired. Please re-login to continue.',

  // Deposit error
  [ERRORS.DEPOSIT_FAILED_ERROR]: 'Please login to deposit funds.',
  [ERRORS.DEPOSIT_WENT_WRONG_ERROR]:
    'Oops! Something went wrong with your deposit. Please try again.',

  // Authorization error
  [ERRORS.AUTHORIZATION_POLICY_ERROR]: 'Please login to authorize policy',

  // Transfer error
  [ERRORS.TRANSFER_LOGIN_FIRST_ERROR]: 'Please login to transfer funds.',

  // Subscribe error
  [ERRORS.SUBSCRIBE_LOGIN_ERROR]: 'Please login to subscribe.',
  [ERRORS.SUBSCRIBE_MINIMUN_DAYS_ERROR]:
    'Please enter a valid number of days (minimum {minDays} days).',
  [ERRORS.INSUFICIENT_BALANCE_ERROR]: 'Insufficient balance to complete the action.',
  [ERRORS.FAILED_JOIN_PROFILE_ERROR]: 'Failed to join the profile.',

  // Follow/ unfollow
  [ERRORS.FOLLOW_UNFOLLOW_OCCURRED_ERROR]: 'An error occurred while processing the action.',

  // METAMASK
  [ERRORS.METAMASK_CONNECTING_FAILED_ERROR]: 'Failed to connect wallet',
  [ERRORS.METAMASK_CHANGE_WALLET_ERROR]: 'Failed to change wallet',

  // REFERALS
  [ERRORS.ALREADY_SENT_INVITATION]: 'You have already sent an invitation to this email address!',
  [ERRORS.ALREADY_ENROLLED]: 'This user is already enrolled!',
  [ERRORS.INVITATION_SEND_ERROR]: 'An error occurred while sending the invitation.',
  [ERRORS.INVITATION_USER_ALREADY_INVITED]: 'This user has already been invited!',
  [ERRORS.INVITATION_USER_CANT_INVITE_SELF]: 'You cannot invite yourself!',
};
