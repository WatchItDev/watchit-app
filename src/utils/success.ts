/**
 * Enum of our known error names.
 */
export enum SUCCESS {
  DEPOSIT_SUCCESSFULLY = 'DEPOSIT_SUCCESSFULLY',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const SUCCESS_MESSAGES: Record<SUCCESS, string> = {
  [SUCCESS.DEPOSIT_SUCCESSFULLY]: 'The deposit was successful.',
};
