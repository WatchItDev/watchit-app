/**
 * Enum of our known warning text.
 */
export enum WARNING {
  NO_WALLET_AUTHORIZATION = "NO_WALLET_AUTHORIZATION",
  NO_WALLET_CONNECTED = "NO_WALLET_CONNECTED",
  INVALID_DEPOSIT_AMOUNT = "INVALID_DEPOSIT_AMOUNT",
  INVALID_WITHDRAW_AMOUNT = "INVALID_WITHDRAW_AMOUNT",
  INVALID_WALLET_ADDRESS = "INVALID_WALLET_ADDRESS",
  BUNDLER_UNAVAILABLE = "BUNDLER_UNAVAILABLE",
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const WARNING_MESSAGES: Record<WARNING, string> = {
  [WARNING.NO_WALLET_AUTHORIZATION]: "No wallet authorization received.",
  [WARNING.NO_WALLET_CONNECTED]: "No wallet connected.",
  [WARNING.INVALID_DEPOSIT_AMOUNT]: "Invalid deposit amount.",
  [WARNING.INVALID_WITHDRAW_AMOUNT]: "Invalid withdraw amount.",
  [WARNING.INVALID_WALLET_ADDRESS]: "Invalid wallet address.",
  [WARNING.BUNDLER_UNAVAILABLE]: "Session expired. Please login again.",
};
