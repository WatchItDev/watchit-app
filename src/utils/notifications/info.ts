/**
 * Enum of our known info names.
 */
export enum INFO {
  DEFAULT = 'DEFAULT',
}

/**
 * Info messages dictionary mapping our INFO_MESSAGES to user-facing strings.
 */
export const INFO_MESSAGES: Record<INFO, string> = {
  [INFO.DEFAULT]: 'Default info message.',
};
