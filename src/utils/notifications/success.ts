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
  PROFILE_METADATA_UPDATED = 'PROFILE_METADATA_UPDATED',
  JOINING_PRICE_SUCCESSFULLY = 'JOINING_PRICE_SUCCESSFULLY',
  PROFILE_UPDATED_SUCCESSFULLY = 'PROFILE_UPDATED_SUCCESSFULLY',
  PROFILE_CREATED_SUCCESSFULLY = 'PROFILE_CREATED_SUCCESSFULLY',
  TRANSFER_CREATED_SUCCESSFULLY = 'TRANSFER_CREATED_SUCCESSFULLY',
  FOLLOW_UNFOLLOW_SUCCESSFULLY = 'FOLLOW_UNFOLLOW_SUCCESSFULLY',
  PROFILE_JOINED_SUCCESSFULLY = 'PROFILE_JOINED_SUCCESSFULLY',
  OWNERSHIP_REGISTERED_SUCCESSFULLY = 'OWNERSHIP_REGISTERED_SUCCESSFULLY',

  // Metamask
  METAMASK_CONNECTED_SUCCESSFULLY = 'METAMASK_CONNECTED_SUCCESSFULLY',
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
  [SUCCESS.JOINING_PRICE_SUCCESSFULLY]: 'Joining price set successfully!.',
  [SUCCESS.PROFILE_CREATED_SUCCESSFULLY]: 'Profile created successfully.',
  [SUCCESS.PROFILE_UPDATED_SUCCESSFULLY]: 'Profile updated successfully.',
  [SUCCESS.TRANSFER_CREATED_SUCCESSFULLY]: 'Transfer sent to {destination}.',
  [SUCCESS.FOLLOW_UNFOLLOW_SUCCESSFULLY]: 'Successfully {profileName} {actionLbl}.',
  [SUCCESS.PROFILE_JOINED_SUCCESSFULLY]: 'Successfully joined the profile.',
  [SUCCESS.OWNERSHIP_REGISTERED_SUCCESSFULLY]: 'Asset {count} successfully processed',

  // Metamask
  [SUCCESS.METAMASK_CONNECTED_SUCCESSFULLY]: 'MetaMask connected successfully!',
}
