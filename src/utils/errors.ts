/**
 * Enum of our known error names.
 */
export enum ERRORS {
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',
  BUNDLER_UNAVAILABLE = 'BUNDLER_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Error messages dictionary mapping our ERROR_NAMES to user-facing strings.
 */
export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.NOT_LOGGED_IN]: 'Please log in to continue.',
  [ERRORS.BUNDLER_UNAVAILABLE]: 'The bundler is currently unavailable.',
  [ERRORS.UNKNOWN_ERROR]: 'An unknown error has occurred.',
};

let globalEnqueueSnackbar: ((message: string, options?: object) => void) | null = null;

/**
 * Allows us to set the globalEnqueueSnackbar function from our App (or any top-level component).
 * Must be called at least once (e.g., in App.tsx) so that notifyError() works.
 */
export function setGlobalErrorNotifier(
  enqueueSnackbarFn: (message: string, options?: object) => void
) {
  globalEnqueueSnackbar = enqueueSnackbarFn;
}

/**
 * Global function to notify an error by ERROR_NAMES.
 * If no message is found in the dictionary, it uses 'UNKNOWN_ERROR'.
 */
export function notifyError(errorName: ERRORS, fallbackMessage?: string) {
  if (!globalEnqueueSnackbar) {
    console.error('No globalEnqueueSnackbar is set. Cannot notify error.');
    return;
  }
  const message =
    ERROR_MESSAGES[errorName] ||
    fallbackMessage ||
    ERROR_MESSAGES[ERRORS.UNKNOWN_ERROR];

  globalEnqueueSnackbar(message, { variant: 'error' });
}
