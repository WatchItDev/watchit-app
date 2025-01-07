/**
 * Enum of our known success texts.
 */
export enum SUCCESS {
  FALLBACK = 'FALLBACK',
  DEPOSIT_SUCCESSFULLY = 'DEPOSIT_SUCCESSFULLY',
  WITHDRAW_SUCCESSFULLY = 'WITHDRAW_SUCCESSFULLY',
  INVITATIONS_SUCCESSFULLY = 'INVITATIONS_SUCCESSFULLY',
  LINK_COPIED_TO_CLIPBOARD = 'LINK_COPIED_TO_CLIPBOARD',
  WALLET_CHANGED_SUCCESFULLY = 'WALLET_CHANGED_SUCCESFULLY',
  PROFILE_METADATA_UPDATED= 'PROFILE_METADATA_UPDATED',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const SUCCESS_MESSAGES: Record<SUCCESS, string> = {
  [SUCCESS.FALLBACK]: 'Fallback.',
  [SUCCESS.DEPOSIT_SUCCESSFULLY]: 'The deposit was successful.',
  [SUCCESS.WITHDRAW_SUCCESSFULLY]: 'The withdraw was successful.',
  [SUCCESS.INVITATIONS_SUCCESSFULLY]: 'The email invitation was sent successfully.',
  [SUCCESS.LINK_COPIED_TO_CLIPBOARD]: 'Link copied to clipboard!.',
  [SUCCESS.WALLET_CHANGED_SUCCESFULLY]: 'Wallet changed successfully!.',
  [SUCCESS.PROFILE_METADATA_UPDATED]: 'Profile metadata updated successfully.',
};
