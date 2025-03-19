import { ERROR_MESSAGES, ERRORS } from '@src/libs/notifications/errors.ts';
import { SUCCESS_MESSAGES, SUCCESS } from '@src/libs/notifications/success.ts';
import { WARNING_MESSAGES, WARNING } from '@src/libs/notifications/warnings.ts';
import { INFO, INFO_MESSAGES } from '@src/libs/notifications/info.ts';

type NotificationType = 'error' | 'success' | 'warning' | 'info';

let globalEnqueueSnackbar: ((message: string, options?: object) => void) | null = null;

interface NotificationOptions {
  variant?: NotificationType;
  autoHideDuration?: number;
  [key: string]: unknown;
}

/**
 * Allows us to set the globalEnqueueSnackbar function from our App (or any top-level component).
 * Must be called at least once (e.g., in App.tsx) so that notify methods works.
 */
export function setGlobalNotifier(enqueueSnackbarFn: (message: string, options?: object) => void) {
  globalEnqueueSnackbar = enqueueSnackbarFn;
}

/**
 * Replaces placeholders of type {variable} in a string, with
 * the values indicated in `data`.
 *
 * Ex:
 * template: "Sent money to {user}, total: {amount}"
 * data: { user: 'Jacob', amount: '100 USDC' }
 * -> "Sent money to Jacob, total: 100 USDC"
 */
function replaceTemplateTags(message: string, data: Record<string, string | number | boolean>): string {
  return message.replace(/{(\w+)}/g, (_substring, key) => {
    return data[key] !== undefined ? String(data[key]) : `{${key}}`;
  });
}

const notify = (
  typeNotification: NotificationType,
  text: ERRORS | SUCCESS | WARNING | INFO,
  data?: Record<string, string | number | boolean>,
  fallbackMessage?: string,
  options?: NotificationOptions
) => {
  if (!globalEnqueueSnackbar) {
    console.error('No globalEnqueueSnackbar is set. Cannot notify messages.');
    return;
  }

  let message: string;
  switch (typeNotification) {
    case 'error':
      message =
        ERROR_MESSAGES[text as ERRORS] || fallbackMessage || ERROR_MESSAGES[ERRORS.UNKNOWN_ERROR];
      break;
    case 'success':
      message = SUCCESS_MESSAGES[text as SUCCESS] || fallbackMessage || 'Operation successful.';
      break;
    case 'warning':
      message = WARNING_MESSAGES[text as WARNING] || fallbackMessage || 'Warning.';
      break;

    case 'info':
      message = INFO_MESSAGES[text as INFO] || fallbackMessage || 'Information.';
      break;

    default:
      console.error('Unknown notification type');
      return;
  }

  if (data) {
    message = replaceTemplateTags(message, data);
  }

  globalEnqueueSnackbar(message, { variant: typeNotification, ...options });
};

/**
 * Global function to notify an error by ERROR_NAMES.
 * If no message is found in the dictionary, it uses 'UNKNOWN_ERROR'.
 */
export function notifyError(
  errorName: ERRORS,
  data?: Record<string, string | number | boolean>,
  fallbackMessage?: string
) {
  notify('error', errorName, data, fallbackMessage || 'An unknown error has occurred.');
}

/**
 * Global function to notify a success by SUCCESS_NAMES.
 * If no message is found in the dictionary, it uses 'Operation successful.'.
 */
export function notifySuccess(
  successName: SUCCESS,
  data?: Record<string, string | number | boolean>,
  fallbackMessage?: string,
  options?: NotificationOptions
) {
  notify('success', successName, data, fallbackMessage || 'Operation successful.', options);
}

/**
 * Global function to notify a warning by WARNING_NAMES.
 * If no message is found in the dictionary, it uses 'Warning.'.
 */
export function notifyWarning(
  warningName: WARNING,
  data?: Record<string, string | number | boolean>,
  fallbackMessage?: string,
  options?: NotificationOptions
) {
  notify('warning', warningName, data, fallbackMessage || 'Warning.', options);
}

/**
 * Global function to notify a info by INFO_NAMES.
 * If no message is found in the dictionary, it uses 'Warning.'.
 */
export function notifyInfo(
  infoName: INFO,
  data?: Record<string, string | number | boolean>,
  fallbackMessage?: string,
  options?: NotificationOptions
) {
  notify('info', infoName, data, fallbackMessage || 'Information.', options);
}
