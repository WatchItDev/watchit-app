import {ERROR_MESSAGES, ERRORS} from "@src/utils/errors";
import { SUCCESS_MESSAGES, SUCCESS} from "@src/utils/success";
import { WARNING_MESSAGES, WARNING} from "@src/utils/warnings";

let globalEnqueueSnackbar: ((message: string, options?: object) => void) | null = null;
type NotificationType = 'error' | 'success' | 'warning';

/**
 * Allows us to set the globalEnqueueSnackbar function from our App (or any top-level component).
 * Must be called at least once (e.g., in App.tsx) so that notifyError() works.
 */
export function setGlobalNotifier(
  enqueueSnackbarFn: (message: string, options?: object) => void
) {
  globalEnqueueSnackbar = enqueueSnackbarFn;
}


const notify = (type: NotificationType, text: ERRORS | SUCCESS | WARNING, fallbackMessage: string) => {
  if (!globalEnqueueSnackbar) {
    console.error('No globalEnqueueSnackbar is set. Cannot notify error.');
    return;
  }

  let message: string;
  switch (type) {
    case 'error':
      message = ERROR_MESSAGES[text as ERRORS] || fallbackMessage || ERROR_MESSAGES[ERRORS.UNKNOWN_ERROR];
      break;
    case 'success':
      message = SUCCESS_MESSAGES[text as SUCCESS] || fallbackMessage || 'Operation successful.';
      break;
    case 'warning':
      message = WARNING_MESSAGES[text as WARNING] || fallbackMessage || 'Warning.';
      break;
    default:
      console.error('Unknown notification type');
      return;
  }
  globalEnqueueSnackbar(message, { variant: type });
}


/**
 * Global function to notify an error by ERROR_NAMES.
 * If no message is found in the dictionary, it uses 'UNKNOWN_ERROR'.
 */
export function notifyError(errorName: ERRORS, fallbackMessage?: string) {
  notify('error', errorName, fallbackMessage || 'An unknown error has occurred.');
}

/**
 * Global function to notify a success by SUCCESS_NAMES.
 * If no message is found in the dictionary, it uses 'Operation successful.'.
 */
export function notifySuccess(successName: SUCCESS, fallbackMessage?: string) {
  notify('success', successName, fallbackMessage || 'Operation successful.');
}

/**
 * Global function to notify a warning by WARNING_NAMES.
 * If no message is found in the dictionary, it uses 'Warning.'.
 */

export function notifyWarning(warningName: WARNING, fallbackMessage?: string) {
  notify('warning', warningName, fallbackMessage || 'Warning.');
}
